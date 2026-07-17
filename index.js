'use strict';

const THEME_STORAGE_KEY = 'xecute-editor-theme';
const state = {
  authorization: '',
  signature: '',
  categories: {},
  definitions: [],
  original: {},
  values: {},
  collapsedOwners: new Set()
};

const message = document.getElementById('message');
const editor = document.getElementById('editor');
const actions = document.getElementById('actions');
const settingsRoot = document.getElementById('settings');
const navigationRoot = document.getElementById('navigation');
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
let navigationObserver;

function storedTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (error) {
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, persist) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  const dark = normalized === 'dark';
  document.documentElement.dataset.theme = normalized;
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', dark ? 'ライトモードに切り替える' : 'ダークモードに切り替える');
  themeLabel.textContent = dark ? 'ダーク' : 'ライト';
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (error) {
    }
  }
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = `notice ${type || ''}`;
}

function base64UrlToBytes(value) {
  let normalized;
  try {
    normalized = decodeURIComponent(value).replace(/\s/g, '');
  } catch (error) {
    throw new Error('EditorリンクのURLエンコードが壊れています。Discordで /editor を再実行してください。');
  }
  if (!/^[A-Za-z0-9_-]+$/.test(normalized) || normalized.length % 4 === 1) {
    throw new Error('EditorリンクのBase64URLデータが壊れています。Discordで /editor を再実行してください。');
  }
  const padding = '='.repeat((4 - normalized.length % 4) % 4);
  try {
    const binary = atob(normalized.replace(/-/g, '+').replace(/_/g, '/') + padding);
    return Uint8Array.from(binary, character => character.charCodeAt(0));
  } catch (error) {
    throw new Error('EditorリンクをBase64URLとして復元できません。Discordで /editor を再実行してください。');
  }
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function decompressJson(encoded) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('このブラウザーは圧縮設定コードに対応していません。');
  }
  const stream = new Blob([base64UrlToBytes(encoded)]).stream().pipeThrough(new DecompressionStream('deflate'));
  const text = await new Response(stream).text();
  return JSON.parse(text);
}

async function compressJson(value) {
  if (typeof CompressionStream === 'undefined') {
    throw new Error('このブラウザーは設定コード生成に対応していません。');
  }
  const input = new TextEncoder().encode(JSON.stringify(value));
  const stream = new Blob([input]).stream().pipeThrough(new CompressionStream('deflate'));
  return bytesToBase64Url(new Uint8Array(await new Response(stream).arrayBuffer()));
}

function validateDefinition(definition, value) {
  if (definition.t === 'BOOLEAN' && typeof value !== 'boolean') {
    throw new Error(`${definition.l}: 真偽値が必要です。`);
  }
  if (definition.t === 'INTEGER') {
    if (!Number.isInteger(value)) throw new Error(`${definition.l}: 整数が必要です。`);
    if (definition.n != null && value < definition.n) throw new Error(`${definition.l}: 最小値は ${definition.n} です。`);
    if (definition.x != null && value > definition.x) throw new Error(`${definition.l}: 最大値は ${definition.x} です。`);
  }
  if (definition.t === 'STRING') {
    if (typeof value !== 'string') throw new Error(`${definition.l}: 文字列が必要です。`);
    if (definition.n != null && value.length < definition.n) throw new Error(`${definition.l}: ${definition.n}文字以上必要です。`);
    if (definition.x != null && value.length > definition.x) throw new Error(`${definition.l}: ${definition.x}文字以内にしてください。`);
  }
  if (definition.t === 'SELECT' && !(definition.c || []).some(choice => choice.v === value)) {
    throw new Error(`${definition.l}: 選択値が不正です。`);
  }
  if ((definition.t === 'CHANNEL' || definition.t === 'ROLE') && !/^(0|[1-9][0-9]{5,24})$/.test(value)) {
    throw new Error(`${definition.l}: Discord IDまたは0を入力してください。`);
  }
}

function createInput(definition) {
  const value = state.values[definition.k];
  let input;

  if (definition.t === 'BOOLEAN') {
    const wrapper = document.createElement('label');
    wrapper.className = 'switch';
    input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = Boolean(value);
    const text = document.createElement('span');
    text.textContent = input.checked ? '有効' : '無効';
    input.addEventListener('change', () => {
      state.values[definition.k] = input.checked;
      text.textContent = input.checked ? '有効' : '無効';
    });
    wrapper.append(input, text);
    return wrapper;
  }

  if (definition.t === 'SELECT') {
    input = document.createElement('select');
    for (const choice of definition.c || []) {
      const option = document.createElement('option');
      option.value = choice.v;
      option.textContent = choice.l;
      input.append(option);
    }
    input.value = value;
    input.addEventListener('change', () => {
      state.values[definition.k] = input.value;
    });
    return input;
  }

  input = document.createElement('input');
  input.type = definition.t === 'INTEGER' ? 'number' : 'text';
  input.value = value;
  if (definition.t === 'CHANNEL' || definition.t === 'ROLE') {
    input.inputMode = 'numeric';
    input.placeholder = definition.t === 'CHANNEL' ? 'DiscordチャンネルID、または0' : 'DiscordロールID、または0';
  }
  if (definition.n != null) input.min = String(definition.n);
  if (definition.x != null) input.max = String(definition.x);
  input.addEventListener('input', () => {
    state.values[definition.k] = definition.t === 'INTEGER' ? Number(input.value) : input.value.trim();
  });
  return input;
}

function ownerFor(definition) {
  if (definition.o) return definition.o;
  const separator = definition.k.indexOf('.');
  return separator > 0 ? definition.k.slice(0, separator) : 'xross';
}

function categoryName(owner) {
  if (state.categories[owner]) return state.categories[owner];
  if (owner === 'xross') return 'System';
  return owner.split(/[-_.]+/).filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function elementId(prefix, value) {
  return `${prefix}-${value.replace(/[^A-Za-z0-9_-]/g, '-')}`;
}

function groupedDefinitions() {
  const groups = new Map();
  for (const definition of state.definitions) {
    const owner = ownerFor(definition);
    if (!groups.has(owner)) groups.set(owner, []);
    groups.get(owner).push(definition);
  }
  return [...groups.entries()].sort(([left], [right]) => {
    if (left === 'xross') return -1;
    if (right === 'xross') return 1;
    return categoryName(left).localeCompare(categoryName(right), 'ja');
  });
}

function settingDescription(definition) {
  if (definition.h) return definition.h;
  return switchDescription(definition.t);
}

function switchDescription(type) {
  switch (type) {
    case 'BOOLEAN': return 'この機能の有効・無効を切り替えます。';
    case 'INTEGER': return 'この設定で使用する数値を指定します。';
    case 'SELECT': return '利用する値を一覧から選択します。';
    case 'CHANNEL': return '対象となるDiscordチャンネルをIDで指定します。';
    case 'ROLE': return '対象となるDiscordロールをIDで指定します。';
    default: return 'この設定項目の値を変更します。';
  }
}

function createSettingRow(definition) {
  const row = document.createElement('div');
  const rowId = elementId('setting', definition.k);
  row.id = rowId;
  row.className = 'setting';

  const information = document.createElement('div');
  const title = document.createElement('div');
  title.id = `${rowId}-title`;
  title.className = 'setting-title';
  title.textContent = definition.l;
  const description = document.createElement('div');
  description.className = 'setting-description';
  description.textContent = settingDescription(definition);
  const key = document.createElement('div');
  key.className = 'setting-key';
  key.textContent = definition.k;
  information.append(title, description, key);

  const input = createInput(definition);
  const control = input.matches && input.matches('input, select') ? input : input.querySelector('input, select');
  if (control) control.setAttribute('aria-labelledby', title.id);
  row.append(information, input);
  return row;
}

function createNavigationBase() {
  const overview = document.createElement('a');
  overview.className = 'nav-home';
  overview.href = '#pageTop';
  const icon = document.createElement('span');
  icon.className = 'nav-home-icon';
  icon.textContent = '⌂';
  icon.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.textContent = '概要';
  overview.append(icon, label);

  const divider = document.createElement('div');
  divider.className = 'nav-divider';
  navigationRoot.append(overview, divider);
}

function createNavigationGroup(owner, definitions, name, categoryId) {
  const navGroup = document.createElement('div');
  navGroup.className = 'nav-group';
  navGroup.dataset.owner = owner;
  if (state.collapsedOwners.has(owner)) navGroup.classList.add('collapsed');

  const categoryRow = document.createElement('div');
  categoryRow.className = 'nav-category-row';
  const categoryLink = document.createElement('a');
  categoryLink.className = 'nav-category';
  categoryLink.href = `#${categoryId}`;
  const categoryIcon = document.createElement('span');
  categoryIcon.className = 'nav-category-icon';
  categoryIcon.textContent = name.charAt(0).toUpperCase();
  const categoryText = document.createElement('span');
  categoryText.className = 'nav-category-label';
  categoryText.textContent = name;
  const count = document.createElement('span');
  count.className = 'nav-count';
  count.textContent = definitions.length;
  categoryLink.append(categoryIcon, categoryText, count);

  const channelsId = elementId('navigation', owner);
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.textContent = '⌃';
  toggle.setAttribute('aria-label', `${name}カテゴリーを折りたたむ`);
  toggle.setAttribute('aria-controls', channelsId);
  toggle.setAttribute('aria-expanded', String(!state.collapsedOwners.has(owner)));
  toggle.addEventListener('click', () => {
    const collapsed = navGroup.classList.toggle('collapsed');
    if (collapsed) state.collapsedOwners.add(owner);
    else state.collapsedOwners.delete(owner);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? `${name}カテゴリーを展開する` : `${name}カテゴリーを折りたたむ`);
  });
  categoryRow.append(categoryLink, toggle);

  const channels = document.createElement('div');
  channels.id = channelsId;
  channels.className = 'nav-channels';
  for (const definition of definitions) {
    const link = document.createElement('a');
    link.className = 'nav-channel';
    link.href = `#${elementId('setting', definition.k)}`;
    const itemLabel = document.createElement('span');
    itemLabel.textContent = definition.l;
    link.append(itemLabel);
    channels.append(link);
  }

  navGroup.append(categoryRow, channels);
  return navGroup;
}

function createCategory(owner, definitions, name, categoryId) {
  const category = document.createElement('section');
  category.id = categoryId;
  category.className = 'category-card';

  const header = document.createElement('header');
  header.className = 'category-header';
  const mark = document.createElement('div');
  mark.className = 'category-mark';
  mark.textContent = name.charAt(0).toUpperCase();
  const heading = document.createElement('div');
  heading.className = 'category-heading';
  const title = document.createElement('h3');
  title.className = 'category-title';
  title.textContent = name;
  const ownerLabel = document.createElement('div');
  ownerLabel.className = 'category-owner';
  ownerLabel.textContent = owner === 'xross' ? 'Xross Engine' : owner;
  heading.append(title, ownerLabel);
  const total = document.createElement('div');
  total.className = 'category-total';
  total.textContent = `${definitions.length} 項目`;
  header.append(mark, heading, total);
  category.append(header);
  definitions.forEach(definition => category.append(createSettingRow(definition)));
  return category;
}

function activateNavigation() {
  if (navigationObserver) navigationObserver.disconnect();
  const links = new Map([...navigationRoot.querySelectorAll('.nav-channel')]
    .map(link => [link.getAttribute('href').slice(1), link]));
  if (!('IntersectionObserver' in window)) return;
  navigationObserver = new IntersectionObserver(entries => {
    const visible = entries.find(entry => entry.isIntersecting);
    if (!visible) return;
    links.forEach(link => link.classList.remove('active'));
    const link = links.get(visible.target.id);
    if (link) link.classList.add('active');
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
  settingsRoot.querySelectorAll('.setting').forEach(row => navigationObserver.observe(row));
}

function render() {
  settingsRoot.replaceChildren();
  navigationRoot.replaceChildren();
  createNavigationBase();

  for (const [owner, definitions] of groupedDefinitions()) {
    const name = categoryName(owner);
    const categoryId = elementId('category', owner);
    navigationRoot.append(createNavigationGroup(owner, definitions, name, categoryId));
    settingsRoot.append(createCategory(owner, definitions, name, categoryId));
  }

  editor.classList.remove('hidden');
  actions.classList.remove('hidden');
  activateNavigation();
}

async function initialize() {
  try {
    let token;
    try {
      token = decodeURIComponent(location.hash.slice(1)).trim();
    } catch (error) {
      throw new Error('EditorリンクのURLエンコードが壊れています。Discordで /editor を再実行してください。');
    }
    const parts = token.split('.', 5);
    if (parts.length !== 5 || parts[0] !== 'XE4E' || parts[1] !== '1') {
      throw new Error('有効なXecute Editorリンクではありません。Discordで /editor を実行してください。');
    }
    const authorization = await decompressJson(parts[2]);
    const payload = await decompressJson(parts[4]);
    if (!authorization.g || !authorization.e || !authorization.n || !Array.isArray(payload.d) || !payload.v) {
      throw new Error('Editorリンクのデータが破損しています。');
    }
    if (authorization.e < Math.floor(Date.now() / 1000)) {
      throw new Error('このEditorリンクは期限切れです。Discordで /editor を再実行してください。');
    }

    state.authorization = parts[2];
    state.signature = parts[3];
    state.categories = payload.c || {};
    state.definitions = payload.d;
    state.original = structuredClone(payload.v);
    state.values = structuredClone(payload.v);

    const guildName = payload.n || 'Discord Server';
    document.getElementById('guildName').textContent = guildName;
    document.getElementById('sidebarGuildName').textContent = guildName;
    document.getElementById('serverInitial').textContent = guildName.charAt(0).toUpperCase();
    document.getElementById('expiry').textContent = `有効期限: ${new Date(authorization.e * 1000).toLocaleString()}`;
    render();
  } catch (error) {
    showMessage(error.message || String(error), 'error');
  }
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
});

document.getElementById('resetButton').addEventListener('click', () => {
  state.values = structuredClone(state.original);
  render();
  showMessage('設定をEditorを開いた時点の値へ戻しました。', '');
});

document.getElementById('copyButton').addEventListener('click', async () => {
  try {
    for (const definition of state.definitions) validateDefinition(definition, state.values[definition.k]);
    const payload = await compressJson({ v: state.values });
    const code = `XE4.1.${state.authorization}.${state.signature}.${payload}`;
    if (code.length > 6000) {
      throw new Error('設定コードがDiscordの入力上限を超えました。設定項目を減らしてください。');
    }
    await navigator.clipboard.writeText(code);
    showMessage('適用コードをコピーしました。Discordで /apply の code に貼り付けてください。', 'success');
  } catch (error) {
    showMessage(error.message || String(error), 'error');
  }
});

applyTheme(storedTheme(), false);
initialize();
