'use strict';

const THEME_STORAGE_KEY = 'xecute-editor-theme';
const SESSION_LINK_PREFIX = 'XE4C.1';
const SESSION_FILE_MAGIC = new TextEncoder().encode('XE4EA1');
const MAX_SESSION_FILE_BYTES = 1024 * 1024;
const I18N = {
  ja: {
    serverSettings: 'サーバー設定',
    xecuteSettings: 'Xecute 設定',
    serverConfiguration: 'サーバー設定',
    heroCopy: 'Xross Engineと各プラグインが公開している設定を、このページからまとめて編集できます。',
    reset: '元に戻す',
    download: '適用ファイルをダウンロード',
    guildScope: 'サーバー設定',
    userScope: 'ユーザー設定',
    noSettingsForScope: 'この対象で利用できる設定はありません。',
    copy: '適用コマンドをコピー',
    importTitle: 'Editorセッションを手動で読み込む',
    importDescription: 'Discordの /editor 応答に添付されたXecuteSession.xe4eをここへドロップするか、ファイルを選択してください。',
    dropZone: 'XecuteSession.xe4eをドロップ',
    chooseSession: 'ファイルを選択',
    navigation: '設定一覧',
    languageAria: '表示言語',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    switchLight: 'ライトモードに切り替える',
    switchDark: 'ダークモードに切り替える',
    enabled: '有効',
    disabled: '無効',
    system: 'システム',
    overview: '概要',
    collapseCategory: '{name}カテゴリーを折りたたむ',
    expandCategory: '{name}カテゴリーを展開する',
    items: '{count} 項目',
    item: '{count} 項目',
    expiry: '有効期限: {date}',
    channelPlaceholder: 'DiscordチャンネルID、または0',
    rolePlaceholder: 'DiscordロールID、または0',
    notSelected: '選択しない',
    unavailableSelection: '現在は利用できない選択肢',
    multiSelectDone: '完了',
    descriptionBoolean: 'この機能の有効・無効を切り替えます。',
    descriptionInteger: 'この設定で使用する数値を指定します。',
    descriptionSelect: '利用する値を一覧から選択します。',
    descriptionChannel: '対象となるDiscordチャンネルをIDで指定します。',
    descriptionRole: '対象となるDiscordロールをIDで指定します。',
    descriptionDefault: 'この設定項目の値を変更します。',
    xrossLanguageLabel: '表示言語',
    xrossLanguageDescription: 'Xross EngineとWebエディターで使用する表示言語です。',
    xrossVoiceVolumeLabel: '音声音量',
    xrossVoiceVolumeDescription: 'このDiscordサーバーで再生する音声の音量です（0～100）。',
    makharaApiKeyDescription: '新しいAPIキーを入力します。保存済みのキーはEditorリンクへ含まれず、空欄なら変更しません。',
    makharaApiModelDescription: 'Makharaが使用するGeminiモデル名です（例: gemini-1.5-flash）。',
    makharaHistoryLimitDescription: 'Geminiへ会話の文脈として送信する直近のDiscordメッセージ数です。',
    makharaCommonPromptDescription: 'このDiscordサーバーの全Makharaプロファイルへ適用する共通ルールです。',
    makharaActiveProfileDescription: 'メッセージの「AIに聞く」で使用するプロファイルキーです。空欄にすると無効になります。',
    makharaExternalProfilesDescription: '他ユーザーが所有する個人プロファイルの、このサーバー内での応答を許可します。',
    welcomeTextEnabledDescription: '初めてボイスチャンネルへ参加したユーザーをテキストで通知します。',
    welcomeTargetChannelDescription: '新規参加通知を送信するテキストチャンネルです。0の場合は送信しません。',
    welcomeVoiceEnabledDescription: '初めて参加したユーザーへウェルカム音声を再生します。',
    invalidUrlEncoding: 'EditorリンクのURLエンコードが壊れています。Discordで /editor を再実行してください。',
    invalidBase64: 'EditorリンクのBase64URLデータが壊れています。Discordで /editor を再実行してください。',
    base64RestoreFailed: 'EditorリンクをBase64URLとして復元できません。Discordで /editor を再実行してください。',
    decompressUnsupported: 'このブラウザーは圧縮設定コードに対応していません。',
    compressUnsupported: 'このブラウザーは設定コード生成に対応していません。',
    corruptedPayload: 'Editorリンクのデータが破損しています。',
    invalidLink: '有効なXecute Editorリンクではありません。Discordで /editor を実行してください。',
    expiredLink: 'このEditorリンクは期限切れです。Discordで /editor を再実行してください。',
    booleanRequired: '{label}: 真偽値が必要です。',
    integerRequired: '{label}: 整数が必要です。',
    minimumValue: '{label}: 最小値は {value} です。',
    maximumValue: '{label}: 最大値は {value} です。',
    stringRequired: '{label}: 文字列が必要です。',
    minimumLength: '{label}: {value}文字以上必要です。',
    maximumLength: '{label}: {value}文字以内にしてください。',
    invalidSelection: '{label}: 選択値が不正です。',
    discordIdRequired: '{label}: Discord IDまたは0を入力してください。',
    resetComplete: '設定をEditorを開いた時点の値へ戻しました。',
    codeTooLarge: '設定コードがDiscordのcode入力上限を超えました。適用ファイルをダウンロードしてください。',
    clipboardFailed: 'クリップボードへコピーできませんでした。ブラウザーの権限を確認してください。',
    copyComplete: '適用コマンドをコピーしました。Discordへ貼り付けてEnterを押すだけで適用できます。',
    fetchingSession: 'Discordから暗号化されたEditorセッションを読み込んでいます…',
    fetchFailed: 'Discord CDNからセッションを自動取得できませんでした。/editor 応答のXecuteSession.xe4eを下へドロップしてください。',
    fetchExpired: 'Discord添付の有効期限が切れたか、アクセスできません。/editor をもう一度実行してください。',
    fetchBlocked: 'Discord CDNへの自動アクセスがブラウザーまたはネットワークで拒否されました。/editor 応答のXecuteSession.xe4eを下へドロップしてください。',
    missingSessionKey: '復号鍵がありません。Discordの /editor 応答にあるEditorリンクをもう一度開いてください。',
    invalidSessionFile: 'XecuteSession.xe4eの形式が正しくありません。',
    sessionFileTooLarge: 'Editorセッションファイルが大きすぎます。',
    decryptUnsupported: 'このブラウザーは暗号化Editorセッションの復号に対応していません。',
    decryptFailed: 'Editorセッションを復号できませんでした。正しい /editor 応答の添付ファイルを使用してください。',
    manualLoadComplete: 'Editorセッションを添付ファイルから読み込みました。',
    downloadComplete: 'XecuteApply.xe4aを保存しました。Discordで /apply の file に指定してください。'
  },
  en: {
    serverSettings: 'Server settings',
    xecuteSettings: 'Xecute settings',
    serverConfiguration: 'Server configuration',
    heroCopy: 'Edit settings published by Xross Engine and its plugins together on this page.',
    reset: 'Reset',
    download: 'Download apply file',
    guildScope: 'Server settings',
    userScope: 'User settings',
    noSettingsForScope: 'No settings are available for this scope.',
    copy: 'Copy apply command',
    importTitle: 'Import the Editor session manually',
    importDescription: 'Drop XecuteSession.xe4e from the Discord /editor response here, or choose the file.',
    dropZone: 'Drop XecuteSession.xe4e',
    chooseSession: 'Choose file',
    navigation: 'Settings navigation',
    languageAria: 'Display language',
    themeLight: 'Light',
    themeDark: 'Dark',
    switchLight: 'Switch to light mode',
    switchDark: 'Switch to dark mode',
    enabled: 'Enabled',
    disabled: 'Disabled',
    system: 'System',
    overview: 'Overview',
    collapseCategory: 'Collapse the {name} category',
    expandCategory: 'Expand the {name} category',
    items: '{count} items',
    item: '{count} item',
    expiry: 'Expires: {date}',
    channelPlaceholder: 'Discord channel ID, or 0',
    rolePlaceholder: 'Discord role ID, or 0',
    notSelected: 'Do not select',
    unavailableSelection: 'Currently unavailable selection',
    multiSelectDone: 'Done',
    descriptionBoolean: 'Enable or disable this feature.',
    descriptionInteger: 'Enter the number used by this setting.',
    descriptionSelect: 'Choose a value from the list.',
    descriptionChannel: 'Enter the Discord channel ID to use.',
    descriptionRole: 'Enter the Discord role ID to use.',
    descriptionDefault: 'Change the value of this setting.',
    xrossLanguageLabel: 'Display language',
    xrossLanguageDescription: 'Language used by Xross Engine and the Web Editor.',
    xrossVoiceVolumeLabel: 'Voice volume',
    xrossVoiceVolumeDescription: 'Voice playback volume for this Discord server (0-100).',
    makharaApiKeyDescription: 'Enter a new API key. Saved keys are never included in Editor links; leave blank to keep the current key.',
    makharaApiModelDescription: 'Gemini model name used by Makhara, for example gemini-1.5-flash.',
    makharaHistoryLimitDescription: 'Number of recent Discord messages sent to Gemini as context.',
    makharaCommonPromptDescription: 'Rules applied to every Makhara profile in this Discord server.',
    makharaActiveProfileDescription: 'Profile key used by the AI message context-menu action. Leave empty to disable it.',
    makharaExternalProfilesDescription: 'Allow personal profiles owned by other users to respond in this server.',
    welcomeTextEnabledDescription: 'Send a text notification when a user joins a voice channel for the first time.',
    welcomeTargetChannelDescription: 'Text channel for new-member notifications. Enter 0 to disable delivery.',
    welcomeVoiceEnabledDescription: 'Play a welcome voice message for first-time participants.',
    invalidUrlEncoding: 'The Editor link has invalid URL encoding. Run /editor again in Discord.',
    invalidBase64: 'The Editor link contains invalid Base64URL data. Run /editor again in Discord.',
    base64RestoreFailed: 'The Editor link could not be decoded as Base64URL. Run /editor again in Discord.',
    decompressUnsupported: 'This browser does not support compressed setting codes.',
    compressUnsupported: 'This browser cannot generate setting codes.',
    corruptedPayload: 'The Editor link data is corrupted.',
    invalidLink: 'This is not a valid Xecute Editor link. Run /editor in Discord.',
    expiredLink: 'This Editor link has expired. Run /editor again in Discord.',
    booleanRequired: '{label}: a boolean value is required.',
    integerRequired: '{label}: an integer is required.',
    minimumValue: '{label}: the minimum value is {value}.',
    maximumValue: '{label}: the maximum value is {value}.',
    stringRequired: '{label}: text is required.',
    minimumLength: '{label}: enter at least {value} characters.',
    maximumLength: '{label}: enter no more than {value} characters.',
    invalidSelection: '{label}: the selected value is invalid.',
    discordIdRequired: '{label}: enter a Discord ID or 0.',
    resetComplete: 'Settings were reset to the values from when the Editor was opened.',
    codeTooLarge: 'The setting code exceeds Discord\'s code input limit. Download the apply file instead.',
    clipboardFailed: 'Could not copy to the clipboard. Check the browser permission.',
    copyComplete: 'Apply command copied. Paste it into Discord and press Enter.',
    fetchingSession: 'Loading the encrypted Editor session from Discord…',
    fetchFailed: 'The session could not be fetched from Discord CDN. Drop XecuteSession.xe4e from the /editor response below.',
    fetchExpired: 'The Discord attachment has expired or is no longer accessible. Run /editor again.',
    fetchBlocked: 'The browser or network blocked automatic access to Discord CDN. Drop XecuteSession.xe4e from the /editor response below.',
    missingSessionKey: 'The decryption key is missing. Open the Editor link from the Discord /editor response again.',
    invalidSessionFile: 'This is not a valid XecuteSession.xe4e file.',
    sessionFileTooLarge: 'The Editor session file is too large.',
    decryptUnsupported: 'This browser cannot decrypt encrypted Editor sessions.',
    decryptFailed: 'The Editor session could not be decrypted. Use the attachment from the matching /editor response.',
    manualLoadComplete: 'The Editor session was loaded from the attachment.',
    downloadComplete: 'XecuteApply.xe4a was saved. Select it in the file option of /apply in Discord.'
  }
};

const state = {
  authorization: '',
  signature: '',
  categories: {},
  channels: [],
  roles: [],
  definitions: [],
  original: {},
  values: {},
  collapsedOwners: new Set(),
  language: 'ja',
  scope: 'GUILD',
  expiresAt: 0,
  transportKey: '',
  attachmentUrl: '',
  activeTab: 'settings',
  initialized: false
};

const message = document.getElementById('message');
const editor = document.getElementById('editor');
const actions = document.getElementById('actions');
const settingsRoot = document.getElementById('settings');
const navigationRoot = document.getElementById('navigation');
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const importPanel = document.getElementById('importPanel');
const dropZone = document.getElementById('dropZone');
const sessionFileInput = document.getElementById('sessionFileInput');
const workspaceMode = document.getElementById('workspaceMode');
const serverBuilderPanel = document.getElementById('serverBuilderPanel');
const serverBuilderJson = document.getElementById('serverBuilderJson');
const serverBuilderGuideUrl = document.getElementById('serverBuilderGuideUrl');
const copyServerBuilderGuide = document.getElementById('copyServerBuilderGuide');
let navigationObserver;

function t(key, values) {
  const dictionary = I18N[state.language] || I18N.ja;
  let text = dictionary[key] || I18N.ja[key] || key;
  for (const [name, value] of Object.entries(values || {})) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

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
  themeToggle.setAttribute('aria-label', dark ? t('switchLight') : t('switchDark'));
  themeLabel.textContent = dark ? t('themeDark') : t('themeLight');
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (error) {
    }
  }
}

function applyLanguage(language) {
  state.language = language === 'en' ? 'en' : 'ja';
  document.documentElement.lang = state.language;
  navigationRoot.setAttribute('aria-label', t('navigation'));
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  applyTheme(document.documentElement.dataset.theme || storedTheme(), false);
  updateExpiry();
  if (state.initialized) {
    render();
  }
}

function definitionLabel(definition) {
  return definition.l || definition.k;
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
    throw new Error(t('invalidUrlEncoding'));
  }
  if (!/^[A-Za-z0-9_-]+$/.test(normalized) || normalized.length % 4 === 1) {
    throw new Error(t('invalidBase64'));
  }
  const padding = '='.repeat((4 - normalized.length % 4) % 4);
  try {
    const binary = atob(normalized.replace(/-/g, '+').replace(/_/g, '/') + padding);
    return Uint8Array.from(binary, character => character.charCodeAt(0));
  } catch (error) {
    throw new Error(t('base64RestoreFailed'));
  }
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function hideMessage() {
  message.className = 'notice hidden';
  message.textContent = '';
}

function showImportPanel() {
  importPanel.classList.remove('hidden');
}

function hideImportPanel() {
  importPanel.classList.add('hidden');
}

function isDiscordAttachmentUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (
      url.hostname === 'cdn.discordapp.com'
      || url.hostname === 'media.discordapp.net'
    );
  } catch (error) {
    return false;
  }
}

async function decryptSessionFile(bytes) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error(t('decryptUnsupported'));
  }
  if (!(bytes instanceof Uint8Array) || bytes.length > MAX_SESSION_FILE_BYTES) {
    throw new Error(t('sessionFileTooLarge'));
  }
  bytes = await extractSessionBytes(bytes);
  if (bytes.length < SESSION_FILE_MAGIC.length + 12 + 16) {
    throw new Error(t('invalidSessionFile'));
  }
  for (let index = 0; index < SESSION_FILE_MAGIC.length; index++) {
    if (bytes[index] !== SESSION_FILE_MAGIC[index]) {
      throw new Error(t('invalidSessionFile'));
    }
  }
  if (!state.transportKey) {
    throw new Error(t('missingSessionKey'));
  }

  try {
    const rawKey = base64UrlToBytes(state.transportKey);
    if (rawKey.length !== 32) throw new Error(t('decryptFailed'));
    const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']);
    const ivStart = SESSION_FILE_MAGIC.length;
    const iv = bytes.slice(ivStart, ivStart + 12);
    const encrypted = bytes.slice(ivStart + 12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
    return new TextDecoder('utf-8', { fatal: true }).decode(decrypted);
  } catch (error) {
    if (error instanceof Error && [t('invalidBase64'), t('base64RestoreFailed'), t('decryptFailed')].includes(error.message)) {
      throw error;
    }
    throw new Error(t('decryptFailed'));
  }
}

async function extractSessionBytes(bytes) {
  if (bytes.length >= SESSION_FILE_MAGIC.length && SESSION_FILE_MAGIC.every((value, index) => bytes[index] === value)) {
    return bytes;
  }
  if (!bytes.length || !window.createImageBitmap || !window.OffscreenCanvas) {
    throw new Error(t('invalidSessionFile'));
  }
  try {
    const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    image.close();
    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const packed = new Uint8Array(canvas.width * canvas.height * 3);
    for (let pixel = 0; pixel < canvas.width * canvas.height; pixel++) {
      packed[pixel * 3] = rgba[pixel * 4];
      packed[pixel * 3 + 1] = rgba[pixel * 4 + 1];
      packed[pixel * 3 + 2] = rgba[pixel * 4 + 2];
    }
    const length = new DataView(packed.buffer).getUint32(0);
    if (length < SESSION_FILE_MAGIC.length + 12 + 16 || length > MAX_SESSION_FILE_BYTES || length > packed.length - 4) {
      throw new Error(t('invalidSessionFile'));
    }
    return packed.slice(4, 4 + length);
  } catch (error) {
    throw new Error(t('invalidSessionFile'));
  }
}

async function fetchSessionToken() {
  if (!isDiscordAttachmentUrl(state.attachmentUrl)) {
    throw new Error(t('invalidLink'));
  }
  const urls = [state.attachmentUrl];
  const mediaUrl = new URL(state.attachmentUrl);
  if (mediaUrl.hostname === 'cdn.discordapp.com') {
    mediaUrl.hostname = 'media.discordapp.net';
    urls.push(mediaUrl.toString());
  } else if (mediaUrl.hostname === 'media.discordapp.net') {
    mediaUrl.hostname = 'cdn.discordapp.com';
    urls.push(mediaUrl.toString());
  }
  let lastError;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        credentials: 'omit',
        referrerPolicy: 'no-referrer'
      });
      if (response.ok) {
        return decryptSessionFile(new Uint8Array(await response.arrayBuffer()));
      }
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        lastError = new Error(t('fetchExpired'));
      } else {
        lastError = new Error(t('fetchFailed'));
      }
    } catch (error) {
      lastError = new Error(t('fetchBlocked'));
    }
  }
  throw lastError || new Error(t('fetchFailed'));
}

async function decompressJson(encoded) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error(t('decompressUnsupported'));
  }
  try {
    const stream = new Blob([base64UrlToBytes(encoded)]).stream().pipeThrough(new DecompressionStream('deflate'));
    const text = await new Response(stream).text();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error && error.message !== t('corruptedPayload')) {
      throw new Error(t('corruptedPayload'));
    }
    throw error;
  }
}

async function compressJson(value) {
  if (typeof CompressionStream === 'undefined') {
    throw new Error(t('compressUnsupported'));
  }
  const input = new TextEncoder().encode(JSON.stringify(value));
  const stream = new Blob([input]).stream().pipeThrough(new CompressionStream('deflate'));
  return bytesToBase64Url(new Uint8Array(await new Response(stream).arrayBuffer()));
}

function validateDefinition(definition, value) {
  const label = definitionLabel(definition);
  if (definition.t === 'BOOLEAN' && typeof value !== 'boolean') {
    throw new Error(t('booleanRequired', { label }));
  }
  if (definition.t === 'INTEGER') {
    if (!Number.isInteger(value)) throw new Error(t('integerRequired', { label }));
    if (definition.n != null && value < definition.n) throw new Error(t('minimumValue', { label, value: definition.n }));
    if (definition.x != null && value > definition.x) throw new Error(t('maximumValue', { label, value: definition.x }));
  }
  if (definition.t === 'STRING') {
    if (typeof value !== 'string') throw new Error(t('stringRequired', { label }));
    if (definition.n != null && value.length < definition.n) throw new Error(t('minimumLength', { label, value: definition.n }));
    if (definition.x != null && value.length > definition.x) throw new Error(t('maximumLength', { label, value: definition.x }));
  }
  if (definition.t === 'SELECT' && !(definition.c || []).some(choice => choice.v === value)) {
    throw new Error(t('invalidSelection', { label }));
  }
  if ((definition.t === 'CHANNEL' || definition.t === 'ROLE') && !/^(0|[1-9][0-9]{5,24})$/.test(value)) {
    throw new Error(t('discordIdRequired', { label }));
  }
  if ((definition.t === 'CHANNEL_LIST' || definition.t === 'ROLE_LIST')
      && (typeof value !== 'string' || !value.split(',').every(id => id.trim() === '' || /^[1-9][0-9]{5,24}(?::(?:true|false))?$/.test(id.trim())))) {
    throw new Error(t('discordIdRequired', { label }));
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
    text.textContent = input.checked ? t('enabled') : t('disabled');
    input.addEventListener('change', () => {
      state.values[definition.k] = input.checked;
      text.textContent = input.checked ? t('enabled') : t('disabled');
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

  if (definition.t === 'CHANNEL' || definition.t === 'ROLE' || definition.t === 'CHANNEL_LIST' || definition.t === 'ROLE_LIST') {
    const isList = definition.t === 'CHANNEL_LIST' || definition.t === 'ROLE_LIST';
    const isChannel = definition.t === 'CHANNEL' || definition.t === 'CHANNEL_LIST';
    const allEntities = isChannel ? state.channels : state.roles;
    const entities = isChannel && Array.isArray(definition.a) && definition.a.length > 0
      ? allEntities.filter(entity => definition.a.includes(entity.t))
      : allEntities;
    if (entities.length > 0) {
      const selectedValues = isList ? String(value).split(',').map(item => item.trim().split(':', 1)[0]).filter(Boolean) : [value];
      const saveListSelection = selected => {
        const existingDetails = new Map(String(state.values[definition.k]).split(',').map(item => {
          const [id, detailed] = item.trim().split(':', 2);
          return [id, detailed === 'true'];
        }));
        state.values[definition.k] = selected.map(id => {
          if (definition.t !== 'CHANNEL_LIST') return id;
          return `${id}:${existingDetails.get(id) === true}`;
        }).join(',');
      };
      if (isList) {
        const combo = document.createElement('div');
        combo.className = 'entity-multi-combo';
        const toggle = document.createElement('button');
        toggle.className = 'entity-multi-toggle';
        toggle.type = 'button';
        const panel = document.createElement('div');
        panel.className = 'entity-multi-panel hidden';
        const list = document.createElement('div');
        list.className = 'entity-multi-select';
        const selectedNames = () => entities
          .filter(entity => [...list.querySelectorAll('input:checked')].some(input => input.value === entity.i))
          .map(entity => entity.n);
        const updateSummary = () => {
          const names = selectedNames();
          toggle.textContent = names.length === 0 ? t('notSelected') : names.join(', ');
        };
        for (const entity of entities) {
          const option = document.createElement('label');
          option.className = 'entity-multi-option';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = entity.i;
          checkbox.checked = selectedValues.includes(entity.i);
          const name = document.createElement('span');
          name.textContent = entity.n;
          checkbox.addEventListener('change', () => {
            saveListSelection([...list.querySelectorAll('input:checked')].map(selected => selected.value));
            updateSummary();
          });
          option.append(checkbox, name);
          list.append(option);
        }
        const done = document.createElement('button');
        done.className = 'entity-multi-done';
        done.type = 'button';
        done.textContent = t('multiSelectDone');
        toggle.addEventListener('click', () => {
          panel.classList.toggle('hidden');
          toggle.setAttribute('aria-expanded', String(!panel.classList.contains('hidden')));
        });
        done.addEventListener('click', () => {
          panel.classList.add('hidden');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        });
        panel.append(list, done);
        combo.append(toggle, panel);
        toggle.setAttribute('aria-expanded', 'false');
        updateSummary();
        return combo;
      }

      input = document.createElement('select');
      const disabled = document.createElement('option');
      disabled.value = '0';
      disabled.textContent = t('notSelected');
      input.append(disabled);
      for (const entity of entities) {
        const option = document.createElement('option');
        option.value = entity.i;
        option.textContent = entity.n;
        input.append(option);
      }
      if (![...input.options].some(option => option.value === value)) {
        const unavailable = document.createElement('option');
        unavailable.value = value;
        unavailable.textContent = t('unavailableSelection');
        input.append(unavailable);
      }
      input.value = value;
      input.addEventListener('change', () => {
        state.values[definition.k] = input.value;
      });
      return input;
    }
  }

  const useTextArea = definition.t === 'STRING' && definition.x != null && definition.x > 500;
  input = document.createElement(useTextArea ? 'textarea' : 'input');
  if (useTextArea) input.rows = 14;
  if (!useTextArea) input.type = definition.t === 'INTEGER' ? 'number' : 'text';
  input.value = value;
  if (definition.t === 'CHANNEL' || definition.t === 'ROLE') {
    input.inputMode = 'numeric';
    input.placeholder = definition.t === 'CHANNEL' ? t('channelPlaceholder') : t('rolePlaceholder');
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
  if (owner === 'xross') return t('system');
  if (state.categories[owner]) return state.categories[owner];
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
    return categoryName(left).localeCompare(categoryName(right), state.language);
  });
}

function settingDescription(definition) {
  return definition.h || switchDescription(definition.t);
}

function switchDescription(type) {
  switch (type) {
    case 'BOOLEAN': return t('descriptionBoolean');
    case 'INTEGER': return t('descriptionInteger');
    case 'SELECT': return t('descriptionSelect');
    case 'CHANNEL': return t('descriptionChannel');
    case 'ROLE': return t('descriptionRole');
    default: return t('descriptionDefault');
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
  title.textContent = definitionLabel(definition);
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
  label.textContent = t('overview');
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
  toggle.setAttribute('aria-label', t('collapseCategory', { name }));
  toggle.setAttribute('aria-controls', channelsId);
  toggle.setAttribute('aria-expanded', String(!state.collapsedOwners.has(owner)));
  toggle.addEventListener('click', () => {
    const collapsed = navGroup.classList.toggle('collapsed');
    if (collapsed) state.collapsedOwners.add(owner);
    else state.collapsedOwners.delete(owner);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', t(collapsed ? 'expandCategory' : 'collapseCategory', { name }));
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
    itemLabel.textContent = definitionLabel(definition);
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
  total.textContent = t(definitions.length === 1 ? 'item' : 'items', { count: definitions.length });
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
  const builder = state.activeTab === 'server-builder' && state.scope === 'GUILD';
  const guildScope = state.scope === 'GUILD';
  if (state.scope === 'ADMIN') {
    renderAdministratorPanel();
    document.getElementById('scopeEyebrow').textContent = 'Xross 管理者専用';
    document.getElementById('sidebarScopeLabel').textContent = 'Xross Admin';
  } else if (builder) {
    const builderLink = document.createElement('a');
    builderLink.className = 'nav-channel active'; builderLink.href = '#server-builder-builder'; builderLink.textContent = 'Builder';
    const guideLink = document.createElement('a');
    guideLink.className = 'nav-channel'; guideLink.href = '#server-builder-guide'; guideLink.textContent = 'AIにJSONを構築してもらうためのガイド';
    navigationRoot.append(builderLink, guideLink);
    document.getElementById('sidebarScopeLabel').textContent = 'ServerBuilder';
  } else {
    createNavigationBase();
    const groups = groupedDefinitions();
    for (const [owner, definitions] of groups) {
      const name = categoryName(owner);
      const categoryId = elementId('category', owner);
      navigationRoot.append(createNavigationGroup(owner, definitions, name, categoryId));
      settingsRoot.append(createCategory(owner, definitions, name, categoryId));
    }
    if (groups.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'scope-empty'; empty.textContent = t('noSettingsForScope'); settingsRoot.append(empty);
    }
    document.getElementById('scopeEyebrow').textContent = t(guildScope ? 'serverConfiguration' : 'userScope');
    document.getElementById('sidebarScopeLabel').textContent = t(guildScope ? 'serverSettings' : 'userScope');
  }

  editor.classList.remove('hidden');
  actions.classList.remove('hidden');
  settingsRoot.classList.toggle('hidden', builder);
  document.getElementById('pageTop').classList.toggle('hidden', builder);
  serverBuilderPanel.classList.toggle('hidden', !builder);
  workspaceMode.value = builder ? 'server-builder' : 'settings';
  workspaceMode.classList.toggle('hidden', state.scope !== 'GUILD');
  document.getElementById('resetButton').textContent = builder ? 'JSONを消去' : t('reset');
  document.getElementById('downloadButton').textContent = builder ? 'ServerBuilderファイルをダウンロード' : t('download');
  document.getElementById('copyButton').textContent = builder ? 'ServerBuilderコマンドをコピー' : t('copy');
  activateNavigation();
}

function renderAdministratorPanel() {
  const card = document.createElement('section');
  card.className = 'scope-empty';
  card.innerHTML = '<h3>Xross 管理者専用画面</h3><p>認定制度の作成・認定付与・取消を行えます。適用時にもBot管理者権限を確認します。</p>';
  const form = document.createElement('div'); form.className = 'setting';
  const action = document.createElement('select'); action.id = 'adminAction';
  [['program', '認定制度を作成・更新'], ['grant', 'ユーザーを認定'], ['revoke', '認定を取消']].forEach(([value, label]) => {
    const option = document.createElement('option'); option.value = value; option.textContent = label; action.append(option);
  });
  form.append(action);
  [
    ['adminProgramId', '制度ID（例: nestware-authorized-developer）'],
    ['adminProgramName', '制度名（制度の作成・更新時）'],
    ['adminDescription', '制度の説明（任意）'],
    ['adminBadge', 'バッジ表示名（任意）'],
    ['adminUserId', 'Discord ユーザーID（認定・取消時）'],
    ['adminProfileName', 'プロフィール名（認定時）'],
    ['adminDetail', 'プロフィール詳細（認定時・任意）']
  ].forEach(([id, placeholder]) => { const input = document.createElement('input'); input.id = id; input.placeholder = placeholder; form.append(input); });
  card.append(form); settingsRoot.append(card);
}

function collectAdministratorValues() {
  const value = id => document.getElementById(id)?.value.trim() || '';
  const action = value('adminAction');
  const values = {
    'xross-admin.action': action,
    'xross-admin.program-id': value('adminProgramId'),
    'xross-admin.program-name': value('adminProgramName'),
    'xross-admin.description': value('adminDescription'),
    'xross-admin.badge': value('adminBadge'),
    'xross-admin.user-id': value('adminUserId'),
    'xross-admin.profile-name': value('adminProfileName'),
    'xross-admin.detail': value('adminDetail')
  };
  if (!values['xross-admin.program-id']) throw new Error('制度IDを入力してください。');
  if (action === 'program' && !values['xross-admin.program-name']) throw new Error('制度名を入力してください。');
  if ((action === 'grant' || action === 'revoke') && !values['xross-admin.user-id']) throw new Error('DiscordユーザーIDを入力してください。');
  if (action === 'grant' && !values['xross-admin.profile-name']) throw new Error('プロフィール名を入力してください。');
  return values;
}

function updateExpiry() {
  if (!state.expiresAt) return;
  const locale = state.language === 'ja' ? 'ja-JP' : 'en-US';
  const date = new Date(state.expiresAt * 1000).toLocaleString(locale);
  document.getElementById('expiry').textContent = t('expiry', { date });
}

async function initializeToken(token) {
  const parts = token.trim().split('.', 5);
  if (parts.length !== 5 || parts[0] !== 'XE4E' || parts[1] !== '1') {
    throw new Error(t('invalidLink'));
  }
  const authorization = await decompressJson(parts[2]);
  const payload = await decompressJson(parts[4]);
  const scope = authorization.s === 'USER' ? 'USER' : authorization.s === 'ADMIN' ? 'ADMIN' : 'GUILD';
  if ((scope === 'GUILD' && !authorization.g) || !authorization.u || !authorization.e || !authorization.n || !Array.isArray(payload.d) || !payload.v) {
    throw new Error(t('corruptedPayload'));
  }
  if (authorization.e < Math.floor(Date.now() / 1000)) {
    throw new Error(t('expiredLink'));
  }

  state.authorization = parts[2];
  state.scope = scope;
  state.signature = parts[3];
  state.categories = payload.c || {};
  state.definitions = payload.d;
  state.channels = Array.isArray(payload.ch) ? payload.ch : [];
  state.roles = Array.isArray(payload.r) ? payload.r : [];
  state.original = structuredClone(payload.v);
  state.values = structuredClone(payload.v);
  state.expiresAt = authorization.e;
  state.initialized = true;
  serverBuilderGuideUrl.textContent = serverBuilderGuideLink();

  applyLanguage(payload.i);

  const guildName = payload.n || 'Discord Server';
  document.getElementById('guildName').textContent = guildName;
  document.getElementById('sidebarGuildName').textContent = guildName;
  document.getElementById('serverInitial').textContent = guildName.charAt(0).toUpperCase();
  hideImportPanel();
  hideMessage();
  updateExpiry();
  render();
}

async function loadSessionFile(file, manual) {
  if (!file || file.size > MAX_SESSION_FILE_BYTES) {
    throw new Error(t('sessionFileTooLarge'));
  }
  const token = await decryptSessionFile(new Uint8Array(await file.arrayBuffer()));
  await initializeToken(token);
  if (manual) showMessage(t('manualLoadComplete'), 'success');
}

async function initialize() {
  const hash = location.hash.slice(1);
  try {
    if (hash.startsWith(`${SESSION_LINK_PREFIX}?`)) {
      const parameters = new URLSearchParams(hash.slice(SESSION_LINK_PREFIX.length + 1));
      state.transportKey = parameters.get('k') || '';
      state.attachmentUrl = parameters.get('u') || '';
      if (!state.transportKey || !state.attachmentUrl) throw new Error(t('invalidLink'));
      showMessage(t('fetchingSession'), '');
      try {
        await initializeToken(await fetchSessionToken());
      } catch (error) {
        showImportPanel();
        showMessage(error.message || t('fetchFailed'), 'error');
      }
      return;
    }

    let token;
    try {
      token = decodeURIComponent(hash).trim();
    } catch (error) {
      throw new Error(t('invalidUrlEncoding'));
    }
    await initializeToken(token);
  } catch (error) {
    showMessage(error.message || String(error), 'error');
  }
}

function collectChangedValues() {
  const changes = {};
  for (const definition of state.definitions) {
    const value = state.values[definition.k];
    validateDefinition(definition, value);
    if (!Object.is(value, state.original[definition.k])) {
      changes[definition.k] = value;
    }
  }
  return changes;
}

async function createApplyCode(changes) {
  const changedValues = changes || (state.scope === 'ADMIN' ? collectAdministratorValues() : collectChangedValues());
  const payload = await compressJson({ v: changedValues });
  return `XE4.1.${state.authorization}.${state.signature}.${payload}`;
}

async function createServerBuilderCode() {
  let plan;
  try {
    plan = JSON.parse(serverBuilderJson.value);
  } catch (error) {
    throw new Error('ServerBuilder JSONの形式が正しくありません。');
  }
  if (!plan || plan.schemaVersion !== 'server-builder/v1') {
    throw new Error('schemaVersion は server-builder/v1 にしてください。');
  }
  const payload = await compressJson({ v: { 'server-builder.plan': plan } });
  return `XE4.1.${state.authorization}.${state.signature}.${payload}`;
}

function useServerBuilderTab() {
  if (state.scope !== 'GUILD') return;
  state.activeTab = 'server-builder';
  render();
}

function useSettingsTab() {
  state.activeTab = 'settings';
  render();
}

function serverBuilderGuideLink() {
  return new URL('server-builder-guide.md', window.location.href).href;
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
});

document.getElementById('resetButton').addEventListener('click', () => {
  if (state.activeTab === 'server-builder') {
    serverBuilderJson.value = '';
    return;
  }
  state.values = structuredClone(state.original);
  render();
  showMessage(t('resetComplete'), '');
});

document.getElementById('downloadButton').addEventListener('click', async () => {
  try {
    const builder = state.activeTab === 'server-builder';
    const code = builder ? await createServerBuilderCode() : await createApplyCode();
    const url = URL.createObjectURL(new Blob([code], { type: 'application/octet-stream' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = builder ? 'ServerBuilder.xe4sb' : 'XecuteApply.xe4a';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showMessage(t('downloadComplete'), 'success');
  } catch (error) {
    showMessage(error.message || String(error), 'error');
  }
});


document.getElementById('copyButton').addEventListener('click', async () => {
  try {
    const builder = state.activeTab === 'server-builder';
    const code = builder ? await createServerBuilderCode() : await createApplyCode();
    const command = builder ? `/server-builder apply code:${code}` : `/apply code:${code}`;
    if (command.length > 6600) {
      throw new Error(t('codeTooLarge'));
    }
    try {
      await navigator.clipboard.writeText(command);
    } catch (error) {
      throw new Error(t('clipboardFailed'));
    }
    showMessage(t('copyComplete'), 'success');
  } catch (error) {
    showMessage(error.message || String(error), 'error');
  }
});

workspaceMode.addEventListener('change', () => {
  if (workspaceMode.value === 'server-builder') useServerBuilderTab();
  else useSettingsTab();
});

copyServerBuilderGuide.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(serverBuilderGuideLink());
    showMessage('AI用ガイドURLをコピーしました。AIにこのURLと作りたいサーバーの内容を渡してください。', 'success');
  } catch (error) {
    showMessage('ガイドURLをコピーできませんでした。', 'error');
  }
});

async function importSelectedFile(file) {
  try {
    await loadSessionFile(file, true);
  } catch (error) {
    showImportPanel();
    showMessage(error.message || String(error), 'error');
  }
}

document.getElementById('chooseSessionButton').addEventListener('click', () => sessionFileInput.click());
sessionFileInput.addEventListener('change', () => {
  const [file] = sessionFileInput.files || [];
  if (file) importSelectedFile(file);
  sessionFileInput.value = '';
});
dropZone.addEventListener('click', () => sessionFileInput.click());
dropZone.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    sessionFileInput.click();
  }
});
for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add('dragging');
  });
}
for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
  });
}
dropZone.addEventListener('drop', event => {
  const [file] = event.dataTransfer.files || [];
  if (file) importSelectedFile(file);
});

applyTheme(storedTheme(), false);
applyLanguage('ja');
initialize();
