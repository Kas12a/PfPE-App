const DEFAULT_ERROR_MESSAGE =
  'Supabase client operations are not fully supported in this offline stub. Ensure network access when invoking Supabase APIs.';

const JSON_CONTENT_TYPE = 'application/json';

function normalizeBaseUrl(url) {
  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('Supabase URL must be a non-empty string.');
  }
  return url.replace(/\/$/, '');
}

function buildError(message) {
  return { message: message || DEFAULT_ERROR_MESSAGE };
}

function encodeFilterValue(value) {
  if (value === null || value === undefined) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return `(${value.map((item) => encodeURIComponent(String(item))).join(',')})`;
  }
  if (typeof value === 'object') {
    return encodeURIComponent(JSON.stringify(value));
  }
  return encodeURIComponent(String(value));
}

function appendQuery(searchParams, key, rawValue) {
  if (!searchParams || !key) return;
  if (Array.isArray(rawValue)) {
    rawValue.forEach((value) => searchParams.append(key, value));
  } else if (rawValue !== undefined && rawValue !== null) {
    searchParams.append(key, rawValue);
  }
}

function ensureFetchAvailable() {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch implementation is required for the Supabase client stub.');
  }
}

class PostgrestQueryBuilder {
  constructor(requestRest, table) {
    this._requestRest = requestRest;
    this._table = table;
    this._method = 'GET';
    this._payload = undefined;
    this._select = '*';
    this._orders = [];
    this._filters = [];
    this._limit = undefined;
    this._single = false;
    this._prefer = new Set();
    this._isUpsert = false;
  }

  select(columns = '*') {
    this._select = columns;
    if (this._method === 'POST') {
      this._prefer.add('return=representation');
    }
    return this;
  }

  order(column, options = {}) {
    const direction = options.ascending === false ? 'desc' : 'asc';
    let clause = `${column}.${direction}`;
    if (options.nullsFirst === true) {
      clause += '.nullsfirst';
    } else if (options.nullsFirst === false) {
      clause += '.nullslast';
    }
    this._orders.push(clause);
    return this;
  }

  limit(count) {
    this._limit = count;
    return this;
  }

  eq(column, value) {
    this._filters.push({ column, operator: 'eq', value });
    return this;
  }

  single() {
    this._single = true;
    return this._execute();
  }

  insert(values) {
    this._method = 'POST';
    this._payload = values;
    return this._execute();
  }

  upsert(values) {
    this._method = 'POST';
    this._payload = values;
    this._isUpsert = true;
    this._prefer.add('resolution=merge-duplicates');
    return this;
  }

  async _execute() {
    const searchParams = new URLSearchParams();
    if (this._select && this._select !== '*') {
      searchParams.set('select', this._select);
    } else if (this._method === 'GET') {
      searchParams.set('select', '*');
    }
    this._filters.forEach(({ column, operator, value }) => {
      searchParams.append(column, `${operator}.${encodeFilterValue(value)}`);
    });
    appendQuery(searchParams, 'order', this._orders);
    if (typeof this._limit === 'number') {
      searchParams.set('limit', String(this._limit));
    }

    let body;
    const headers = {};

    if (this._method === 'POST') {
      const payload = Array.isArray(this._payload) ? this._payload : [this._payload];
      body = JSON.stringify(payload);
      headers['Content-Type'] = JSON_CONTENT_TYPE;
      if (this._prefer.size > 0) {
        headers.Prefer = Array.from(this._prefer).join(',');
      }
      if (this._isUpsert && !headers.Prefer) {
        headers.Prefer = 'resolution=merge-duplicates';
      }
      if (!headers.Prefer && this._select) {
        headers.Prefer = 'return=minimal';
      }
    }

    const path = searchParams.toString()
      ? `${this._table}?${searchParams.toString()}`
      : this._table;

    const { data, error } = await this._requestRest(path, {
      method: this._method,
      headers,
      body,
    });

    if (error) {
      return { data: null, error };
    }

    if (this._single) {
      const item = Array.isArray(data) ? data[0] ?? null : data ?? null;
      return { data: item, error: null };
    }

    return { data: data ?? null, error: null };
  }

  then(onFulfilled, onRejected) {
    return this._execute().then(onFulfilled, onRejected);
  }
}

function createClient(url, anonKey) {
  ensureFetchAvailable();
  if (typeof anonKey !== 'string' || !anonKey.trim()) {
    throw new Error('Supabase anon key must be a non-empty string.');
  }

  const baseUrl = normalizeBaseUrl(url);
  const restBase = `${baseUrl}/rest/v1`;
  const authBase = `${baseUrl}/auth/v1`;
  const storageBase = `${baseUrl}/storage/v1`;

  let session = null;

  const buildHeaders = (customHeaders = {}, hasBody = false) => {
    const headers = { ...customHeaders };
    headers.apikey = anonKey;
    if (session && session.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    if (hasBody && !headers['Content-Type']) {
      headers['Content-Type'] = JSON_CONTENT_TYPE;
    }
    return headers;
  };

  const safeParse = async (response) => {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (error) {
      return text;
    }
  };

  const request = async (endpoint, { method = 'GET', headers = {}, body } = {}) => {
    const hasBody = body !== undefined && body !== null;
    const response = await fetch(endpoint, {
      method,
      headers: buildHeaders(headers, hasBody),
      body,
    });

    const payload = await safeParse(response);
    if (!response.ok) {
      const message = payload && payload.message ? payload.message : response.statusText;
      return { data: null, error: buildError(message || DEFAULT_ERROR_MESSAGE) };
    }

    return { data: payload, error: null };
  };

  const requestRest = (path, options) => {
    const endpoint = `${restBase}/${path}`;
    return request(endpoint, options);
  };

  const requestAuth = (path, options) => {
    const endpoint = `${authBase}/${path}`;
    return request(endpoint, options);
  };

  const requestStorage = (path, options) => {
    const endpoint = `${storageBase}/${path}`;
    return request(endpoint, options);
  };

  const buildPublicStorageUrl = (bucket, path) => {
    const cleanPath = path.replace(/^\/+/, '');
    return `${storageBase}/object/public/${bucket}/${cleanPath}`;
  };

  const auth = {
    async signInWithPassword(credentials) {
      const body = JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
      });
      const { data, error } = await requestAuth('token?grant_type=password', {
        method: 'POST',
        headers: { 'Content-Type': JSON_CONTENT_TYPE },
        body,
      });

      if (!error && data) {
        session = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user ?? null,
        };
      }

      return {
        data: {
          session,
          user: session ? session.user : null,
        },
        error,
      };
    },

    async signInWithIdToken(credentials) {
      const body = JSON.stringify({
        id_token: credentials?.token,
        provider: credentials?.provider ?? 'google',
        nonce: credentials?.nonce,
      });
      const { data, error } = await requestAuth('token?grant_type=id_token', {
        method: 'POST',
        headers: { 'Content-Type': JSON_CONTENT_TYPE },
        body,
      });

      if (!error && data) {
        session = {
          access_token: data.access_token ?? null,
          refresh_token: data.refresh_token ?? null,
          user: data.user ?? null,
        };
      }

      return {
        data: {
          session,
          user: session ? session.user : null,
        },
        error,
      };
    },

    async signUp(credentials) {
      const body = JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
        options: credentials?.options ?? {},
      });
      const { data, error } = await requestAuth('signup', {
        method: 'POST',
        headers: { 'Content-Type': JSON_CONTENT_TYPE },
        body,
      });

      if (!error && data) {
        session = {
          access_token: data.access_token ?? null,
          refresh_token: data.refresh_token ?? null,
          user: data.user ?? null,
        };
      }

      return {
        data: {
          session,
          user: session ? session.user : null,
        },
        error,
      };
    },

    async signOut() {
      if (!session) {
        return { error: null };
      }

      const { error } = await requestAuth('logout', {
        method: 'POST',
        headers: { 'Content-Type': JSON_CONTENT_TYPE },
      });

      if (!error) {
        session = null;
      }

      return { error };
    },

    async getUser() {
      if (!session || !session.access_token) {
        return { data: { user: null }, error: null };
      }

      const { data, error } = await requestAuth('user', {
        method: 'GET',
      });

      if (!error && data) {
        session.user = data;
      }

      return {
        data: { user: session ? session.user : null },
        error,
      };
    },
  };

  const from = (table) => {
    return new PostgrestQueryBuilder(requestRest, table);
  };

  const storage = {
    from(bucket) {
      if (!bucket || typeof bucket !== 'string') {
        throw new Error('Storage bucket must be a non-empty string.');
      }
      const bucketName = bucket;
      return {
        async upload(path, file, options = {}) {
          if (!path || typeof path !== 'string') {
            throw new Error('Storage upload path must be provided.');
          }
          const cleanPath = path.replace(/^\/+/, '');
          const query = options.upsert ? '?upsert=true' : '';
          const headers = {};
          if (options.contentType) {
            headers['Content-Type'] = options.contentType;
          }
          const { error } = await requestStorage(`object/${bucketName}/${cleanPath}${query}`, {
            method: 'POST',
            headers,
            body: file,
          });

          if (error) {
            return { data: null, error };
          }

          return { data: { path: cleanPath }, error: null };
        },

        getPublicUrl(path) {
          if (!path || typeof path !== 'string') {
            return { data: null, error: buildError('Storage path must be provided.') };
          }
          return {
            data: { publicUrl: buildPublicStorageUrl(bucketName, path) },
            error: null,
          };
        },
      };
    },
  };

  return {
    auth,
    from,
    storage,
  };
}

module.exports = {
  createClient,
};
