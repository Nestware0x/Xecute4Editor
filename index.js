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
    selectPlugin: '左側から表示するプラグインを選択してください。',
    copy: '適用コマンドをコピー',
    importTitle: 'Editorセッションを手動で読み込む',
    importDescription: 'DiscordのEditor応答に添付されたファイルをここへドロップするか、ファイルを選択してください。',
    dropZone: 'Editorファイルをドロップ',
    chooseSession: 'ファイルを選択',
    navigation: '設定一覧',
    languageAria: '表示言語',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    switchLight: 'ライトモードに切り替える',
    switchDark: 'ダークモードに切り替える',
    enabled: '有効',
    disabled: '無効',
    partnerRequired: 'Xecute Partner Program認定済みのサーバー管理者のみ有効化できます。',
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
    bumpingAutomatic: '自動検知候補（要コマンドID確認）',
    bumpingManual: '手動タイマープリセット',
    bumpingCustom: '自由登録サービス',
    bumpingAdd: 'サービスを追加',
    bumpingRemove: '削除',
    bumpingName: '表示名',
    bumpingEnabled: '監視する',
    bumpingDetection: '検知方式',
    bumpingCommandResponse: '公開コマンド応答',
    bumpingSuccessResponse: '成功応答を確認（実験的）',
    bumpingManualOnly: '手動タイマーのみ',
    bumpingCooldown: '通知周期（分）',
    bumpingApplicationId: 'Application / Bot ID',
    bumpingCommandPath: 'コマンドパス',
    bumpingCommandId: 'コマンドID',
    bumpingCommandHelp: 'コマンドIDを設定すると、通知にクリックできる巨大な実コマンドメンションを表示します。',
    bumpingSuccessPhrases: '成功判定語（1行に1件）',
    bumpingActionUrl: 'サービスURL',
    bumpingNextAt: '次回通知日時',
    bumpingPaused: '一時停止',
    bumpingNotScheduled: '未設定',
    bumpingInvalidConfig: 'Bumpingのサービス設定が壊れています。',
    bumpingCustomLimit: '自由登録サービスは20件までです。',
    bumpingChannelRequired: 'Bumpingを有効にする場合は、bump/up専用チャンネルを選択してください。',
    descriptionBoolean: 'この機能の有効・無効を切り替えます。',
    descriptionInteger: 'この設定で使用する数値を指定します。',
    descriptionSelect: '利用する値を一覧から選択します。',
    descriptionChannel: '対象となるDiscordチャンネルをIDで指定します。',
    descriptionRole: '対象となるDiscordロールをIDで指定します。',
    descriptionDefault: 'この設定項目の値を変更します。',
    durationSeconds: '秒',
    durationMinutes: '分',
    durationHours: '時間',
    xrossLanguageLabel: '表示言語',
    xrossLanguageDescription: 'Xross EngineとWebエディターで使用する表示言語です。',
    xrossVoiceVolumeLabel: '音声音量',
    xrossVoiceVolumeDescription: 'このDiscordサーバーで再生する音声の音量です（0～100）。',
    makharaApiKeyDescription: '新しい接続キーを入力します。保存済みのキーはEditorリンクへ含まれず、空欄なら変更しません。',
    makharaApiModelDescription: 'Makharaが使用するGeminiモデル名です（例: gemini-1.5-flash）。',
    makharaHistoryLimitDescription: 'Geminiへ会話の文脈として送信する直近のDiscordメッセージ数です。',
    makharaCommonPromptDescription: 'このDiscordサーバーの全Makharaプロファイルへ適用する共通ルールです。',
    makharaActiveProfileDescription: 'メッセージの「AIに聞く」で使用するプロファイルキーです。空欄にすると無効になります。',
    makharaExternalProfilesDescription: '他ユーザーが所有する個人プロファイルの、このサーバー内での応答を許可します。',
    welcomeTextEnabledDescription: '初めてボイスチャンネルへ参加したユーザーをテキストで通知します。',
    welcomeTargetChannelDescription: '新規参加通知を送信するテキストチャンネルです。0の場合は送信しません。',
    welcomeVoiceEnabledDescription: '初めて参加したユーザーへウェルカム音声を再生します。',
    invalidUrlEncoding: 'EditorリンクのURLエンコードが壊れています。Discordで /editor を再実行してください。',
    invalidBase64: 'Editorリンクを確認できませんでした。Discordで /editor を再実行してください。',
    base64RestoreFailed: 'Editorリンクを読み込めませんでした。Discordで /editor を再実行してください。',
    decompressUnsupported: 'このブラウザーは圧縮設定コードに対応していません。',
    compressUnsupported: 'このブラウザーは設定コード生成に対応していません。',
    corruptedPayload: 'Editorリンクのデータが破損しています。',
    invalidLink: '有効なXecute Editorリンクではありません。Discordで /editor を実行してください。',
    expiredLink: 'このEditorリンクは期限切れです。Discordで /editor を再実行してください。',
    booleanRequired: '{label}: 真偽値が必要です。',
    integerRequired: '{label}: 整数が必要です。',
    minimumValue: '{label}: 最小値は {value} です。',
    maximumValue: '{label}: 最大値は {value} です。',
    durationMaximum: '{label}: 最大7日相当まで設定できます。',
    stringRequired: '{label}: 文字列が必要です。',
    minimumLength: '{label}: {value}文字以上必要です。',
    maximumLength: '{label}: {value}文字以内にしてください。',
    invalidSelection: '{label}: 選択値が不正です。',
    discordIdRequired: '{label}: Discord IDまたは0を入力してください。',
    resetComplete: '設定をEditorを開いた時点の値へ戻しました。',
    codeTooLarge: '設定コードがDiscordのcode入力上限を超えました。適用ファイルをダウンロードしてください。',
    clipboardFailed: 'クリップボードへコピーできませんでした。ブラウザーの権限を確認してください。',
    copyComplete: '適用コマンドをコピーしました。Discordへ貼り付けてEnterを押すだけで適用できます。',
    fetchingSession: 'DiscordからEditor情報を読み込んでいます…',
    fetchFailed: 'Editor情報を自動取得できませんでした。DiscordのEditor応答にあるファイルを下へドロップしてください。',
    fetchExpired: 'Discord添付の有効期限が切れたか、アクセスできません。/editor をもう一度実行してください。',
    fetchBlocked: 'Editor情報へのアクセスが拒否されました。DiscordのEditor応答にあるファイルを下へドロップしてください。',
    missingSessionKey: 'Editor情報を開くための情報がありません。Discordの /editor 応答にあるリンクをもう一度開いてください。',
    invalidSessionFile: '選択したEditorファイルを読み込めません。',
    sessionFileTooLarge: '選択したEditorファイルが大きすぎます。',
    decryptUnsupported: 'このブラウザーではEditor情報を安全に開けません。',
    decryptFailed: 'Editor情報を開けませんでした。対応する /editor 応答のファイルを使用してください。',
    manualLoadComplete: 'Editorセッションを添付ファイルから読み込みました。',
    downloadComplete: 'XecuteApply.xe4aを保存しました。Discordで /apply の file に指定してください。',
    erifyGraph: 'Erify Graph',
    erifyGraphTitle: 'Erify 関連ユーザー検索',
    erifyGraphLead: 'DiscordユーザーIDを入力すると、本人と利用環境が一致する可能性のあるユーザーを一覧で確認できます。',
    erifyGraphEmpty: '確認できるErify記録がありません。',
    erifyGraphUsers: '確認済みユーザー',
    erifyGraphSignals: '共有された利用情報',
    erifyGraphLinks: '関連記録',
    erifyGraphSearch: 'DiscordユーザーIDを入力',
    erifyGraphSearchHint: '完全なユーザーIDを入力してください。',
    erifyGraphNoMatch: '一致するユーザーが見つかりません。',
    erifyGraphPrimary: '検索したユーザー',
    erifyGraphRelated: '関連する可能性のあるユーザー',
    erifyGraphGenerated: '最終更新: {date}',
    erifyGraphRestricted: '詳細情報は、このサーバーを管理できる認定パートナーだけが確認できます。',
    erifyGraphDetailsVisible: '管理権限とパートナー認定を確認しました。詳細情報を表示できます。',
    erifyGraphSameDevice: '同じ端末',
    erifyGraphSameConnection: '同じ接続元',
    erifyGraphSameBrowser: '同じ利用環境',
    erifyGraphNearbyConnection: '近い接続範囲',
    erifyGraphSimilarContext: '似た接続環境',
    erifyGraphUserId: 'ユーザーID',
    erifyGraphResult: '確認結果',
    erifyGraphAttention: '注意度',
    erifyGraphAccountCreated: 'アカウント作成日時',
    erifyGraphIpAddress: '接続元アドレス',
    erifyGraphEmailAddress: '登録メールアドレス',
    erifyGraphLocation: 'おおよその地域',
    erifyGraphProvider: '接続事業者',
    erifyGraphRisk: '追加確認が必要な接続',
    erifyGraphAutomation: '自動操作の可能性',
    erifyGraphTimezoneMismatch: '利用地域の不一致',
    erifyGraphDecisionPass: '認証済み',
    erifyGraphDecisionReview: '追加確認',
    erifyGraphDecisionDeny: '認証不可',
    erifyGraphUnknown: '不明',
    erifyGraphYes: 'はい',
    erifyGraphNo: 'いいえ'
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
    selectPlugin: 'Select a plugin on the left to show its settings.',
    copy: 'Copy apply command',
    importTitle: 'Import the Editor session manually',
    importDescription: 'Drop the file from the Discord Editor response here, or choose it below.',
    dropZone: 'Drop the Editor file',
    chooseSession: 'Choose file',
    navigation: 'Settings navigation',
    languageAria: 'Display language',
    themeLight: 'Light',
    themeDark: 'Dark',
    switchLight: 'Switch to light mode',
    switchDark: 'Switch to dark mode',
    enabled: 'Enabled',
    disabled: 'Disabled',
    partnerRequired: 'Only a server manager certified by the Xecute Partner Program can enable this feature.',
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
    bumpingAutomatic: 'Auto-detection candidates (verification required)',
    bumpingManual: 'Manual timer presets',
    bumpingCustom: 'Custom services',
    bumpingAdd: 'Add service',
    bumpingRemove: 'Remove',
    bumpingName: 'Display name',
    bumpingEnabled: 'Monitor',
    bumpingDetection: 'Detection mode',
    bumpingCommandResponse: 'Public command response',
    bumpingSuccessResponse: 'Confirm success response (experimental)',
    bumpingManualOnly: 'Manual timer only',
    bumpingCooldown: 'Reminder interval (minutes)',
    bumpingApplicationId: 'Application / Bot ID',
    bumpingCommandPath: 'Command path',
    bumpingCommandId: 'Command ID',
    bumpingCommandHelp: 'Set the command ID to show a large clickable command mention in reminders.',
    bumpingSuccessPhrases: 'Success phrases (one per line)',
    bumpingActionUrl: 'Service URL',
    bumpingNextAt: 'Next reminder',
    bumpingPaused: 'Paused',
    bumpingNotScheduled: 'Not scheduled',
    bumpingInvalidConfig: 'The Bumping service configuration is invalid.',
    bumpingCustomLimit: 'You can register up to 20 custom services.',
    bumpingChannelRequired: 'Select a bump/up channel before enabling Bumping.',
    descriptionBoolean: 'Enable or disable this feature.',
    descriptionInteger: 'Enter the number used by this setting.',
    descriptionSelect: 'Choose a value from the list.',
    descriptionChannel: 'Enter the Discord channel ID to use.',
    descriptionRole: 'Enter the Discord role ID to use.',
    descriptionDefault: 'Change the value of this setting.',
    durationSeconds: 'Seconds',
    durationMinutes: 'Minutes',
    durationHours: 'Hours',
    xrossLanguageLabel: 'Display language',
    xrossLanguageDescription: 'Language used by Xross Engine and the Web Editor.',
    xrossVoiceVolumeLabel: 'Voice volume',
    xrossVoiceVolumeDescription: 'Voice playback volume for this Discord server (0-100).',
    makharaApiKeyDescription: 'Enter a new connection key. Saved keys are never included in Editor links; leave blank to keep the current key.',
    makharaApiModelDescription: 'Gemini model name used by Makhara, for example gemini-1.5-flash.',
    makharaHistoryLimitDescription: 'Number of recent Discord messages sent to Gemini as context.',
    makharaCommonPromptDescription: 'Rules applied to every Makhara profile in this Discord server.',
    makharaActiveProfileDescription: 'Profile key used by the AI message context-menu action. Leave empty to disable it.',
    makharaExternalProfilesDescription: 'Allow personal profiles owned by other users to respond in this server.',
    welcomeTextEnabledDescription: 'Send a text notification when a user joins a voice channel for the first time.',
    welcomeTargetChannelDescription: 'Text channel for new-member notifications. Enter 0 to disable delivery.',
    welcomeVoiceEnabledDescription: 'Play a welcome voice message for first-time participants.',
    invalidUrlEncoding: 'The Editor link has invalid URL encoding. Run /editor again in Discord.',
    invalidBase64: 'The Editor link could not be verified. Run /editor again in Discord.',
    base64RestoreFailed: 'The Editor link could not be loaded. Run /editor again in Discord.',
    decompressUnsupported: 'This browser does not support compressed setting codes.',
    compressUnsupported: 'This browser cannot generate setting codes.',
    corruptedPayload: 'The Editor link data is corrupted.',
    invalidLink: 'This is not a valid Xecute Editor link. Run /editor in Discord.',
    expiredLink: 'This Editor link has expired. Run /editor again in Discord.',
    booleanRequired: '{label}: a boolean value is required.',
    integerRequired: '{label}: an integer is required.',
    minimumValue: '{label}: the minimum value is {value}.',
    maximumValue: '{label}: the maximum value is {value}.',
    durationMaximum: '{label}: the maximum is 7 days.',
    stringRequired: '{label}: text is required.',
    minimumLength: '{label}: enter at least {value} characters.',
    maximumLength: '{label}: enter no more than {value} characters.',
    invalidSelection: '{label}: the selected value is invalid.',
    discordIdRequired: '{label}: enter a Discord ID or 0.',
    resetComplete: 'Settings were reset to the values from when the Editor was opened.',
    codeTooLarge: 'The setting code exceeds Discord\'s code input limit. Download the apply file instead.',
    clipboardFailed: 'Could not copy to the clipboard. Check the browser permission.',
    copyComplete: 'Apply command copied. Paste it into Discord and press Enter.',
    fetchingSession: 'Loading Editor information from Discord…',
    fetchFailed: 'Editor information could not be loaded automatically. Drop the file from the Discord Editor response below.',
    fetchExpired: 'The Discord attachment has expired or is no longer accessible. Run /editor again.',
    fetchBlocked: 'Access to the Editor information was blocked. Drop the file from the Discord Editor response below.',
    missingSessionKey: 'Information required to open the Editor is missing. Open the link from the Discord /editor response again.',
    invalidSessionFile: 'The selected Editor file could not be read.',
    sessionFileTooLarge: 'The selected Editor file is too large.',
    decryptUnsupported: 'This browser cannot open the Editor information safely.',
    decryptFailed: 'The Editor information could not be opened. Use the file from the matching /editor response.',
    manualLoadComplete: 'The Editor session was loaded from the attachment.',
    downloadComplete: 'XecuteApply.xe4a was saved. Select it in the file option of /apply in Discord.',
    erifyGraph: 'Erify Graph',
    erifyGraphTitle: 'Erify related user search',
    erifyGraphLead: 'Enter a Discord user ID to list that user and other users who may share the same device or connection.',
    erifyGraphEmpty: 'No Erify records are available.',
    erifyGraphUsers: 'Verified users',
    erifyGraphSignals: 'Shared usage information',
    erifyGraphLinks: 'Relationship records',
    erifyGraphSearch: 'Enter a Discord user ID',
    erifyGraphSearchHint: 'Enter the complete user ID.',
    erifyGraphNoMatch: 'No matching user was found.',
    erifyGraphPrimary: 'Searched user',
    erifyGraphRelated: 'Potentially related users',
    erifyGraphGenerated: 'Last updated: {date}',
    erifyGraphRestricted: 'Details are available only to certified partners who can manage this server.',
    erifyGraphDetailsVisible: 'Server management access and partner certification were confirmed. Details are available.',
    erifyGraphSameDevice: 'Same device',
    erifyGraphSameConnection: 'Same connection',
    erifyGraphSameBrowser: 'Same usage environment',
    erifyGraphNearbyConnection: 'Nearby connection range',
    erifyGraphSimilarContext: 'Similar connection environment',
    erifyGraphUserId: 'User ID',
    erifyGraphResult: 'Verification result',
    erifyGraphAttention: 'Attention level',
    erifyGraphAccountCreated: 'Account created',
    erifyGraphIpAddress: 'Connection address',
    erifyGraphEmailAddress: 'Registered email address',
    erifyGraphLocation: 'Approximate location',
    erifyGraphProvider: 'Connection provider',
    erifyGraphRisk: 'Connection needs additional review',
    erifyGraphAutomation: 'Possible automated activity',
    erifyGraphTimezoneMismatch: 'Usage region mismatch',
    erifyGraphDecisionPass: 'Verified',
    erifyGraphDecisionReview: 'Needs review',
    erifyGraphDecisionDeny: 'Not verified',
    erifyGraphUnknown: 'unknown',
    erifyGraphYes: 'yes',
    erifyGraphNo: 'no'
  }
};

const state = {
  authorization: '',
  signature: '',
  categories: {},
  channels: [],
  roles: [],
  extensions: {},
  definitions: [],
  original: {},
  values: {},
  collapsedOwners: new Set(),
  activeOwner: null,
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
    const attachmentPath = url.pathname.startsWith('/attachments/')
      || url.pathname.startsWith('/ephemeral-attachments/');
    return url.protocol === 'https:' && attachmentPath && (
      url.hostname === 'cdn.discordapp.com'
      || url.hostname === 'media.discordapp.net'
    );
  } catch (error) {
    return false;
  }
}

async function readBoundedResponse(response) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > MAX_SESSION_FILE_BYTES) {
    throw new Error(t('sessionFileTooLarge'));
  }
  if (!response.body || typeof response.body.getReader !== 'function') {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.length > MAX_SESSION_FILE_BYTES) throw new Error(t('sessionFileTooLarge'));
    return bytes;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_SESSION_FILE_BYTES) {
        await reader.cancel();
        throw new Error(t('sessionFileTooLarge'));
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
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
        return decryptSessionFile(await readBoundedResponse(response));
      }
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        lastError = new Error(t('fetchExpired'));
      } else {
        lastError = new Error(t('fetchFailed'));
      }
    } catch (error) {
      lastError = error instanceof TypeError
        ? new Error(t('fetchBlocked'))
        : error;
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
    const unitKey = durationUnitKey(definition);
    if (unitKey) {
      const factor = durationFactor(state.values[unitKey]);
      if (!factor || value * factor > 604_800) throw new Error(t('durationMaximum', { label }));
    }
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
  if (definition.k === BUMPING_CONFIG_KEY) validateBumpingSettings();
}

function validateBumpingSettings() {
  const model = parseBumpingState();
  if (!model) throw new Error(t('bumpingInvalidConfig'));
  const ids = new Set();
  let customCount = 0;
  for (const service of model.config.services) {
    if (!service || !/^[a-z0-9][a-z0-9-]{0,39}$/.test(service.id || '') || ids.has(service.id)) {
      throw new Error(t('bumpingInvalidConfig'));
    }
    ids.add(service.id);
    if (!service.builtIn && ++customCount > 20) throw new Error(t('bumpingCustomLimit'));
    if (typeof service.name !== 'string' || !service.name.trim() || service.name.length > 80) throw new Error(t('bumpingInvalidConfig'));
    if (!['COMMAND_RESPONSE', 'SUCCESS_RESPONSE', 'MANUAL'].includes(service.detectionMode)) throw new Error(t('bumpingInvalidConfig'));
    if (!Number.isInteger(service.cooldownMinutes) || service.cooldownMinutes < 1 || service.cooldownMinutes > 10080) {
      throw new Error(t('bumpingInvalidConfig'));
    }
    for (const snowflake of [service.applicationId, service.commandId]) {
      if (snowflake && !/^[1-9][0-9]{5,24}$/.test(snowflake)) throw new Error(t('bumpingInvalidConfig'));
    }
    if (service.detectionMode !== 'MANUAL' && (!service.applicationId || !service.commandPath || !service.commandId)) {
      throw new Error(t('bumpingInvalidConfig'));
    }
    const phrases = Array.isArray(service.successPhrases) ? service.successPhrases : [];
    if (phrases.length > 10 || phrases.some(phrase => typeof phrase !== 'string' || !phrase.trim() || phrase.length > 120)) {
      throw new Error(t('bumpingInvalidConfig'));
    }
    if (service.detectionMode === 'SUCCESS_RESPONSE' && phrases.length === 0) throw new Error(t('bumpingInvalidConfig'));
    if (service.actionUrl) {
      try {
        const url = new URL(service.actionUrl);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch (error) {
        throw new Error(t('bumpingInvalidConfig'));
      }
    }
  }
  for (const [id, schedule] of Object.entries(model.schedules.items)) {
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(id) || !schedule || !Number.isFinite(schedule.nextAt)
        || schedule.nextAt < 0 || typeof schedule.paused !== 'boolean') {
      throw new Error(t('bumpingInvalidConfig'));
    }
  }
}

function createInput(definition) {
  const value = state.values[definition.k];
  let input;

  const duration = durationInput(definition);
  if (duration) return duration;

  if (definition.t === 'BOOLEAN') {
    const wrapper = document.createElement('label');
    wrapper.className = 'switch';
    input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = Boolean(value);
    input.disabled = enableRequiresPartner(definition);
    if (input.disabled) input.title = t('partnerRequired');
    const text = document.createElement('span');
    text.textContent = input.checked ? t('enabled') : t('disabled');
    input.addEventListener('change', () => {
      state.values[definition.k] = input.checked;
      text.textContent = input.checked ? t('enabled') : t('disabled');
      if (isEnabledDefinition(definition)) render();
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

function isEnabledDefinition(definition, owner = ownerFor(definition)) {
  if (definition.t !== 'BOOLEAN') return false;
  const key = String(definition.k || '').toLowerCase();
  return key === `${owner}.enabled` || /(?:^|[._-])enable(?:d)?$/.test(key);
}

function enableRequiresPartner(definition) {
  return definition.k === 'ai-report.enabled'
    && state.extensions['ai-report-access']?.canEnable !== true
    && !state.values[definition.k];
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
    if (isDurationUnitDefinition(definition) || isBumpingBackingDefinition(definition)) continue;
    const owner = ownerFor(definition);
    if (!groups.has(owner)) groups.set(owner, []);
    groups.get(owner).push(definition);
  }
  for (const [owner, definitions] of groups) {
    definitions.sort((left, right) => Number(isEnabledDefinition(right, owner)) - Number(isEnabledDefinition(left, owner)));
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

const DURATION_UNIT_PAIRS = Object.freeze({
  'anonymous-send.message-cooldown-hours': 'anonymous-send.message-cooldown-unit',
  'anonymous-send.forum-cooldown-hours': 'anonymous-send.forum-cooldown-unit'
});
const DURATION_UNIT_FACTORS = Object.freeze({ seconds: 1, minutes: 60, hours: 3600 });
const BUMPING_CONFIG_KEY = 'bumping.service-config';
const BUMPING_SCHEDULE_KEY = 'bumping.manual-schedules';

function durationUnitKey(definition) {
  return DURATION_UNIT_PAIRS[definition.k] || null;
}

function isDurationUnitDefinition(definition) {
  return Object.values(DURATION_UNIT_PAIRS).includes(definition.k);
}

function durationFactor(unit) {
  return DURATION_UNIT_FACTORS[unit] || 0;
}

function durationUnitLabel(unit) {
  return t(unit === 'seconds' ? 'durationSeconds' : unit === 'minutes' ? 'durationMinutes' : 'durationHours');
}

function isBumpingBackingDefinition(definition) {
  return definition.k === BUMPING_SCHEDULE_KEY;
}

function parseBumpingState() {
  try {
    const config = JSON.parse(state.values[BUMPING_CONFIG_KEY]);
    const schedules = JSON.parse(state.values[BUMPING_SCHEDULE_KEY]);
    if (config?.v !== 1 || !Array.isArray(config.services) || schedules?.v !== 1 || !schedules.items || typeof schedules.items !== 'object') {
      throw new Error(t('bumpingInvalidConfig'));
    }
    return { config, schedules };
  } catch (error) {
    return null;
  }
}

function storeBumpingState(model) {
  state.values[BUMPING_CONFIG_KEY] = JSON.stringify(model.config);
  state.values[BUMPING_SCHEDULE_KEY] = JSON.stringify(model.schedules);
}

function bumpingLocalDate(epochMillis) {
  if (!epochMillis) return '';
  const date = new Date(Number(epochMillis));
  if (!Number.isFinite(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function bumpingField(labelText, control, helpText = '') {
  const field = document.createElement('label');
  field.className = 'bumping-field';
  const label = document.createElement('span');
  label.textContent = labelText;
  field.append(label, control);
  if (helpText) {
    const help = document.createElement('small');
    help.textContent = helpText;
    field.append(help);
  }
  return field;
}

function bumpingTextInput(value, update, options = {}) {
  const input = document.createElement(options.multiline ? 'textarea' : 'input');
  if (!options.multiline) input.type = options.type || 'text';
  if (options.multiline) input.rows = options.rows || 3;
  input.value = value == null ? '' : String(value);
  if (options.min != null) input.min = String(options.min);
  if (options.max != null) input.max = String(options.max);
  if (options.placeholder) input.placeholder = options.placeholder;
  input.addEventListener(options.type === 'datetime-local' ? 'change' : 'input', () => update(input.value));
  return input;
}

function createBumpingServiceCard(service, model) {
  const card = document.createElement('article');
  card.className = 'bumping-service-card';
  const header = document.createElement('header');
  header.className = 'bumping-service-header';
  const identity = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = service.name || service.id;
  const id = document.createElement('code');
  id.textContent = service.id;
  identity.append(title, id);
  const enabled = document.createElement('label');
  enabled.className = 'bumping-check';
  const enabledInput = document.createElement('input');
  enabledInput.type = 'checkbox';
  enabledInput.checked = service.enabled !== false;
  const enabledText = document.createElement('span');
  enabledText.textContent = t('bumpingEnabled');
  enabledInput.addEventListener('change', () => {
    service.enabled = enabledInput.checked;
    storeBumpingState(model);
  });
  enabled.append(enabledInput, enabledText);
  header.append(identity, enabled);

  const fields = document.createElement('div');
  fields.className = 'bumping-fields';
  fields.append(bumpingField(t('bumpingName'), bumpingTextInput(service.name, value => {
    service.name = value.trim();
    title.textContent = service.name || service.id;
    storeBumpingState(model);
  })));

  const detection = document.createElement('select');
  [
    ['COMMAND_RESPONSE', t('bumpingCommandResponse')],
    ['SUCCESS_RESPONSE', t('bumpingSuccessResponse')],
    ['MANUAL', t('bumpingManualOnly')]
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    detection.append(option);
  });
  detection.value = service.detectionMode || 'MANUAL';
  detection.addEventListener('change', () => {
    service.detectionMode = detection.value;
    storeBumpingState(model);
    successField.classList.toggle('hidden', detection.value !== 'SUCCESS_RESPONSE');
  });
  fields.append(bumpingField(t('bumpingDetection'), detection));

  const cooldown = bumpingTextInput(service.cooldownMinutes || 120, value => {
    service.cooldownMinutes = Number(value);
    storeBumpingState(model);
  }, { type: 'number', min: 1, max: 10080 });
  fields.append(bumpingField(t('bumpingCooldown'), cooldown));

  fields.append(bumpingField(t('bumpingApplicationId'), bumpingTextInput(service.applicationId, value => {
    service.applicationId = value.trim();
    storeBumpingState(model);
  })));
  fields.append(bumpingField(t('bumpingCommandPath'), bumpingTextInput(service.commandPath, value => {
    service.commandPath = value.trim().replace(/^\//, '');
    storeBumpingState(model);
  })));
  fields.append(bumpingField(t('bumpingCommandId'), bumpingTextInput(service.commandId, value => {
    service.commandId = value.trim();
    storeBumpingState(model);
  }), t('bumpingCommandHelp')));
  fields.append(bumpingField(t('bumpingActionUrl'), bumpingTextInput(service.actionUrl, value => {
    service.actionUrl = value.trim();
    storeBumpingState(model);
  })));

  const successInput = bumpingTextInput((service.successPhrases || []).join('\n'), value => {
    service.successPhrases = value.split(/\r?\n/).map(item => item.trim()).filter(Boolean).slice(0, 10);
    storeBumpingState(model);
  }, { multiline: true, rows: 3 });
  const successField = bumpingField(t('bumpingSuccessPhrases'), successInput);
  successField.classList.toggle('hidden', detection.value !== 'SUCCESS_RESPONSE');
  fields.append(successField);

  if (!model.schedules.items[service.id]) model.schedules.items[service.id] = { nextAt: 0, paused: false };
  const schedule = model.schedules.items[service.id];
  const nextAt = bumpingTextInput(bumpingLocalDate(schedule.nextAt), value => {
    schedule.nextAt = value ? new Date(value).getTime() : 0;
    storeBumpingState(model);
  }, { type: 'datetime-local' });
  fields.append(bumpingField(t('bumpingNextAt'), nextAt, t('bumpingNotScheduled')));

  const paused = document.createElement('label');
  paused.className = 'bumping-check bumping-pause';
  const pausedInput = document.createElement('input');
  pausedInput.type = 'checkbox';
  pausedInput.checked = schedule.paused === true;
  pausedInput.addEventListener('change', () => {
    schedule.paused = pausedInput.checked;
    storeBumpingState(model);
  });
  const pausedText = document.createElement('span');
  pausedText.textContent = t('bumpingPaused');
  paused.append(pausedInput, pausedText);
  fields.append(paused);

  card.append(header, fields);
  if (!service.builtIn) {
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'bumping-remove';
    remove.textContent = t('bumpingRemove');
    remove.addEventListener('click', () => {
      model.config.services = model.config.services.filter(item => item !== service);
      delete model.schedules.items[service.id];
      storeBumpingState(model);
      render();
    });
    card.append(remove);
  }
  return card;
}

function createBumpingServiceEditor(definition) {
  const row = document.createElement('div');
  row.id = elementId('setting', definition.k);
  row.className = 'setting bumping-editor';
  const title = document.createElement('div');
  title.className = 'setting-title';
  title.textContent = definitionLabel(definition);
  const description = document.createElement('div');
  description.className = 'setting-description';
  description.textContent = settingDescription(definition);
  const key = document.createElement('div');
  key.className = 'setting-key';
  key.textContent = definition.k;
  row.append(title, description, key);

  const model = parseBumpingState();
  if (!model) {
    const invalid = document.createElement('p');
    invalid.className = 'bumping-invalid';
    invalid.textContent = t('bumpingInvalidConfig');
    row.append(invalid);
    return row;
  }

  const groups = [
    [t('bumpingAutomatic'), service => service.builtIn && service.tier === 'AUTOMATIC'],
    [t('bumpingManual'), service => service.builtIn && service.tier === 'MANUAL'],
    [t('bumpingCustom'), service => !service.builtIn]
  ];
  const body = document.createElement('div');
  body.className = 'bumping-groups';
  groups.forEach(([label, predicate]) => {
    const group = document.createElement('section');
    group.className = 'bumping-group';
    const heading = document.createElement('h4');
    heading.textContent = label;
    const cards = document.createElement('div');
    cards.className = 'bumping-service-grid';
    model.config.services.filter(predicate).forEach(service => cards.append(createBumpingServiceCard(service, model)));
    group.append(heading, cards);
    if (label === t('bumpingCustom')) {
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'bumping-add';
      add.textContent = t('bumpingAdd');
      add.addEventListener('click', () => {
        const customs = model.config.services.filter(service => !service.builtIn);
        if (customs.length >= 20) {
          showMessage(t('bumpingCustomLimit'), 'error');
          return;
        }
        let sequence = Date.now().toString(36);
        while (model.config.services.some(service => service.id === `custom-${sequence}`)) sequence += 'x';
        model.config.services.push({
          id: `custom-${sequence}`, name: 'Custom service', tier: 'MANUAL', builtIn: false,
          enabled: true, detectionMode: 'MANUAL', applicationId: '', commandPath: '', commandId: '',
          cooldownMinutes: 120, successPhrases: [], actionUrl: ''
        });
        storeBumpingState(model);
        render();
      });
      group.append(add);
    }
    body.append(group);
  });
  storeBumpingState(model);
  row.append(body);
  return row;
}

function durationInput(definition) {
  const unitKey = durationUnitKey(definition);
  if (!unitKey) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'duration-control';
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'duration-number';
  input.step = '1';
  input.min = String(definition.n == null ? 1 : definition.n);
  const unit = document.createElement('select');
  unit.className = 'duration-unit';
  unit.setAttribute('aria-label', definitionLabel(definition));
  for (const value of Object.keys(DURATION_UNIT_FACTORS)) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = durationUnitLabel(value);
    unit.append(option);
  }
  const selectedUnit = DURATION_UNIT_FACTORS[state.values[unitKey]] ? state.values[unitKey] : 'hours';
  const updateBounds = () => {
    const factor = durationFactor(unit.value);
    input.max = String(Math.floor(604_800 / factor));
  };
  input.value = state.values[definition.k];
  unit.value = selectedUnit;
  updateBounds();
  input.addEventListener('input', () => {
    state.values[definition.k] = Number(input.value);
  });
  unit.addEventListener('change', () => {
    state.values[unitKey] = unit.value;
    updateBounds();
  });
  wrapper.append(input, unit);
  return wrapper;
}

function createSettingRow(definition) {
  if (definition.k === BUMPING_CONFIG_KEY) return createBumpingServiceEditor(definition);
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
  const enabledDefinition = definitions.find(definition => isEnabledDefinition(definition, owner));
  if (enabledDefinition && !state.values[enabledDefinition.k]) navGroup.classList.add('disabled');

  const categoryRow = document.createElement('div');
  categoryRow.className = 'nav-category-row';
  const categoryLink = document.createElement('a');
  categoryLink.className = 'nav-category';
  if (state.activeOwner === owner) categoryLink.classList.add('active');
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
  categoryLink.addEventListener('click', event => {
    event.preventDefault();
    if (state.activeOwner === owner) return;
    state.activeOwner = owner;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

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
  categoryRow.append(categoryLink);
  if (enabledDefinition) {
    const enabled = document.createElement('label');
    enabled.className = 'nav-enabled';
    enabled.title = `${name}: ${state.values[enabledDefinition.k] ? t('enabled') : t('disabled')}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(state.values[enabledDefinition.k]);
    checkbox.disabled = enableRequiresPartner(enabledDefinition);
    if (checkbox.disabled) enabled.title = t('partnerRequired');
    checkbox.setAttribute('aria-label', enabled.title);
    checkbox.addEventListener('change', () => {
      state.values[enabledDefinition.k] = checkbox.checked;
      render();
    });
    enabled.append(checkbox);
    categoryRow.append(enabled);
  }
  categoryRow.append(toggle);

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

function renderErifyRelationshipGraph() {
  const graph = state.extensions.erify;
  const page = document.createElement('section');
  page.className = 'erify-graph-viewer';
  const heading = document.createElement('div'); heading.className = 'erify-graph-heading';
  const title = document.createElement('h3'); title.textContent = t('erifyGraphTitle');
  const lead = document.createElement('p');
  lead.textContent = t('erifyGraphLead');
  heading.append(title, lead);
  page.append(heading);
  if (!graph || graph.type !== 'erify-relationship-graph' || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
    const empty = document.createElement('p'); empty.textContent = t('erifyGraphEmpty'); page.append(empty); settingsRoot.append(page); return;
  }

  const nodes = graph.nodes.slice(0, 500);
  const nodeIds = new Set(nodes.map(node => node.id));
  const edges = graph.edges.filter(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)).slice(0, 2000);
  const users = nodes.filter(node => node.kind === 'user');
  const signals = nodes.filter(node => node.kind === 'signal');
  const summary = document.createElement('div'); summary.className = 'erify-graph-summary';
  [[t('erifyGraphUsers'), users.length], [t('erifyGraphSignals'), signals.length], [t('erifyGraphLinks'), edges.length]].forEach(([label, value]) => {
    const card = document.createElement('div'); card.innerHTML = `<strong>${value}</strong><span>${label}</span>`; summary.append(card);
  });
  page.append(summary);

  const search = document.createElement('input');
  search.type = 'search'; search.className = 'erify-graph-search'; search.placeholder = t('erifyGraphSearch');
  search.inputMode = 'numeric'; search.autocomplete = 'off'; search.setAttribute('aria-label', t('erifyGraphSearch'));
  page.append(search);
  const access = document.createElement('p');
  access.className = 'erify-graph-note';
  access.textContent = graph.sensitiveDetailsVisible
    ? t('erifyGraphDetailsVisible')
    : t('erifyGraphRestricted');
  page.append(access);
  const results = document.createElement('div'); results.className = 'erify-results';
  page.append(results);
  const userById = new Map(users.map(user => [user.id, user]));
  const edgesByUser = new Map();
  const edgesBySignal = new Map();
  edges.forEach(edge => {
    if (!edgesByUser.has(edge.source)) edgesByUser.set(edge.source, []);
    if (!edgesBySignal.has(edge.target)) edgesBySignal.set(edge.target, []);
    edgesByUser.get(edge.source).push(edge);
    edgesBySignal.get(edge.target).push(edge);
  });
  const reasonLabels = {
    device: 'erifyGraphSameDevice', network: 'erifyGraphSameConnection', browser: 'erifyGraphSameBrowser',
    'network-prefix': 'erifyGraphNearbyConnection', 'network-context': 'erifyGraphSimilarContext'
  };
  const decisionLabel = decision => {
    const key = String(decision || '').toUpperCase();
    return key === 'PASS' ? t('erifyGraphDecisionPass')
      : key === 'REVIEW' ? t('erifyGraphDecisionReview')
        : key === 'DENY' ? t('erifyGraphDecisionDeny') : t('erifyGraphUnknown');
  };
  const addDetail = (list, label, value) => {
    if (value === undefined || value === null || value === '') return;
    const row = document.createElement('div');
    const term = document.createElement('dt'); term.textContent = label;
    const detail = document.createElement('dd'); detail.textContent = String(value);
    row.append(term, detail); list.append(row);
  };
  const renderUser = (user, reasons, primary) => {
    const card = document.createElement('article'); card.className = `erify-user-card${primary ? ' primary' : ''}`;
    const header = document.createElement('div'); header.className = 'erify-user-header';
    const id = document.createElement('strong'); id.textContent = String(user.label || user.id.replace(/^u:/, ''));
    const badge = document.createElement('span'); badge.textContent = primary ? t('erifyGraphPrimary') : t('erifyGraphRelated');
    header.append(id, badge); card.append(header);
    if (reasons.size) {
      const reasonList = document.createElement('div'); reasonList.className = 'erify-reasons';
      [...reasons].forEach(reason => {
        const chip = document.createElement('span'); chip.textContent = t(reasonLabels[reason] || 'erifyGraphSimilarContext'); reasonList.append(chip);
      });
      card.append(reasonList);
    }
    const details = document.createElement('dl'); details.className = 'erify-user-details';
    addDetail(details, t('erifyGraphUserId'), user.label);
    addDetail(details, t('erifyGraphResult'), decisionLabel(user.decision));
    addDetail(details, t('erifyGraphAttention'), Number(user.score || 0));
    addDetail(details, t('erifyGraphAccountCreated'), user.accountCreatedAt
      ? new Date(user.accountCreatedAt * 1000).toLocaleString(state.language === 'en' ? 'en-US' : 'ja-JP') : t('erifyGraphUnknown'));
    if (graph.sensitiveDetailsVisible) {
      addDetail(details, t('erifyGraphIpAddress'), user.ipAddress);
      addDetail(details, t('erifyGraphEmailAddress'), user.emailAddress);
      addDetail(details, t('erifyGraphLocation'), [user.country, user.region, user.city].filter(Boolean).join(' / '));
      addDetail(details, t('erifyGraphProvider'), user.asOrganization);
      addDetail(details, t('erifyGraphRisk'), user.asnRisk || user.tor ? t('erifyGraphYes') : t('erifyGraphNo'));
      addDetail(details, t('erifyGraphAutomation'), user.automation ? t('erifyGraphYes') : t('erifyGraphNo'));
      addDetail(details, t('erifyGraphTimezoneMismatch'), user.timezoneMismatch ? t('erifyGraphYes') : t('erifyGraphNo'));
    }
    card.append(details); return card;
  };
  const updateResults = () => {
    results.replaceChildren();
    const query = search.value.trim();
    if (!query) { const hint = document.createElement('p'); hint.className = 'erify-graph-note'; hint.textContent = t('erifyGraphSearchHint'); results.append(hint); return; }
    const primary = users.find(user => String(user.label) === query || user.id === `u:${query}`);
    if (!primary) { const empty = document.createElement('p'); empty.className = 'erify-empty-result'; empty.textContent = t('erifyGraphNoMatch'); results.append(empty); return; }
    results.append(renderUser(primary, new Set(), true));
    const related = new Map();
    (edgesByUser.get(primary.id) || []).forEach(edge => {
      (edgesBySignal.get(edge.target) || []).forEach(candidate => {
        if (candidate.source === primary.id || !userById.has(candidate.source)) return;
        if (!related.has(candidate.source)) related.set(candidate.source, new Set());
        related.get(candidate.source).add(edge.type);
      });
    });
    [...related.entries()]
      .sort((left, right) => right[1].size - left[1].size || String(userById.get(left[0]).label).localeCompare(String(userById.get(right[0]).label)))
      .forEach(([userId, reasons]) => results.append(renderUser(userById.get(userId), reasons, false)));
  };
  search.addEventListener('input', updateResults);
  updateResults();
  const note = document.createElement('p'); note.className = 'erify-graph-note';
  note.textContent = t('erifyGraphGenerated', {
    date: new Date((graph.generatedAt || 0) * 1000).toLocaleString(state.language === 'en' ? 'en-US' : 'ja-JP')
  });
  page.append(note); settingsRoot.append(page);
}

function render() {
  settingsRoot.replaceChildren();
  navigationRoot.replaceChildren();
  const builder = state.activeTab === 'server-builder' && state.scope === 'GUILD';
  const guildScope = state.scope === 'GUILD';
  if (state.scope === 'ADMIN') {
    renderAdministratorPanelV2();
    document.getElementById('scopeEyebrow').textContent = 'Xross 管理者専用';
  } else if (builder) {
    const builderLink = document.createElement('a');
    builderLink.className = 'nav-channel active'; builderLink.href = '#server-builder-builder'; builderLink.textContent = 'Builder';
    const guideLink = document.createElement('a');
    guideLink.className = 'nav-channel'; guideLink.href = '#server-builder-guide'; guideLink.textContent = 'AIにサーバー構成を作ってもらうためのガイド';
    navigationRoot.append(builderLink, guideLink);
  } else {
    createNavigationBase();
    const groups = groupedDefinitions();
    if (state.activeOwner && !groups.some(([owner]) => owner === state.activeOwner)) state.activeOwner = groups[0]?.[0] || null;
    if (!state.activeOwner && groups.length > 0) state.activeOwner = groups[0][0];
    for (const [owner, definitions] of groups) {
      const name = categoryName(owner);
      const categoryId = elementId('category', owner);
      navigationRoot.append(createNavigationGroup(owner, definitions, name, categoryId));
      if (owner === state.activeOwner) settingsRoot.append(createCategory(owner, definitions, name, categoryId));
    }
    if (groups.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'scope-empty'; empty.textContent = t('noSettingsForScope'); settingsRoot.append(empty);
    } else if (!state.activeOwner) {
      const empty = document.createElement('div');
      empty.className = 'scope-empty'; empty.textContent = t('selectPlugin'); settingsRoot.append(empty);
    }
    document.getElementById('scopeEyebrow').textContent = t(guildScope ? 'serverConfiguration' : 'userScope');
  }

  editor.classList.remove('hidden');
  actions.classList.remove('hidden');
  settingsRoot.classList.toggle('hidden', builder);
  document.getElementById('pageTop').classList.toggle('hidden', builder);
  serverBuilderPanel.classList.toggle('hidden', !builder);
  workspaceMode.value = builder ? 'server-builder' : 'settings';
  workspaceMode.classList.toggle('hidden', state.scope !== 'GUILD');
  document.getElementById('resetButton').textContent = builder ? '構成データを消去' : t('reset');
  document.getElementById('downloadButton').textContent = builder ? 'ServerBuilderファイルをダウンロード' : t('download');
  document.getElementById('copyButton').textContent = builder ? 'ServerBuilderコマンドをコピー' : t('copy');
  activateNavigation();
}

function renderAdministratorPanelV2() {
  const page = document.createElement('section');
  page.className = 'admin-editor';
  const title = document.createElement('h3'); title.textContent = '認定制度を管理';
  const lead = document.createElement('p'); lead.textContent = '操作を選ぶと、必要な項目だけが表示されます。入力後は画面下部の「適用コマンドをコピー」を押し、Discordで /apply を実行してください。';
  const actionBlock = document.createElement('div'); actionBlock.className = 'admin-card';
  const actionLabel = document.createElement('label'); actionLabel.htmlFor = 'adminAction'; actionLabel.textContent = '操作';
  const action = document.createElement('select'); action.id = 'adminAction';
  [['program', '制度を作成・更新'], ['grant', 'ユーザーを認定'], ['revoke', '認定を取り消す']].forEach(([value, label]) => {
    const option = document.createElement('option'); option.value = value; option.textContent = label; action.append(option);
  });
  const actionHelp = document.createElement('p'); actionHelp.className = 'admin-help';
  actionBlock.append(actionLabel, action, actionHelp);
  const program = adminFieldGroup('adminProgramFields', '制度の情報', [
    ['adminProgramId', '制度ID', '英小文字・数字・ハイフン。例: nestware-authorized-developer', true],
    ['adminProgramName', '表示名', '例: Nestware Authorized Developer', true],
    ['adminDescription', '説明', '制度の目的や対象者（任意）', false],
    ['adminBadge', 'バッジ名', 'プロフィールに表示する短い名称（任意）', false]
  ]);
  const member = adminFieldGroup('adminMemberFields', '認定するユーザー', [
    ['adminUserId', 'DiscordユーザーID', 'ユーザーのプロフィールからコピーした数字のID', true],
    ['adminProfileName', 'プロフィール名', '例: 公式パートナー / Authorized Developer', true],
    ['adminDetail', 'プロフィール詳細', '認定理由・担当分野など（任意）', false]
  ]);
  page.append(title, lead, actionBlock, program, member);
  settingsRoot.append(page);
  addAdministratorCandidates(page);
  const update = () => {
    const mode = action.value;
    program.style.display = '';
    member.style.display = mode === 'program' ? 'none' : '';
    document.getElementById('adminProgramName').closest('.admin-field').style.display = mode === 'program' ? '' : 'none';
    document.getElementById('adminDescription').closest('.admin-field').style.display = mode === 'program' ? '' : 'none';
    document.getElementById('adminBadge').closest('.admin-field').style.display = mode === 'program' ? '' : 'none';
    document.getElementById('adminProfileName').closest('.admin-field').style.display = mode === 'grant' ? '' : 'none';
    document.getElementById('adminDetail').closest('.admin-field').style.display = mode === 'grant' ? '' : 'none';
    actionHelp.textContent = mode === 'program' ? '新しい制度を登録、または既存制度の表示名・説明を更新します。'
      : mode === 'grant' ? '既にある制度にユーザーを登録します。Xecute Partnerの付与もここから行えます。'
      : '対象ユーザーの制度プロフィールを削除します。制度そのものは削除されません。';
  };
  action.addEventListener('change', update); update();
}

function addAdministratorCandidates(page) {
  const programs = Array.isArray(state.original['xross-admin.candidates.programs']) ? state.original['xross-admin.candidates.programs'] : [];
  const profiles = Array.isArray(state.original['xross-admin.candidates.profiles']) ? state.original['xross-admin.candidates.profiles'] : [];
  const programList = document.createElement('datalist'); programList.id = 'adminProgramCandidates';
  programs.forEach(program => { const option = document.createElement('option'); option.value = program.id; option.label = program.name || program.id; programList.append(option); });
  const userList = document.createElement('datalist'); userList.id = 'adminUserCandidates';
  const renderUsers = () => {
    const selectedProgram = document.getElementById('adminProgramId')?.value.trim() || '';
    userList.replaceChildren();
    profiles.filter(profile => !selectedProgram || profile.programId === selectedProgram).forEach(profile => {
      const option = document.createElement('option');
      option.value = String(profile.userId);
      option.label = `${profile.displayName || '認定済みユーザー'} (${profile.programId})`;
      userList.append(option);
    });
  };
  page.append(programList, userList);
  const programInput = document.getElementById('adminProgramId');
  programInput.setAttribute('list', programList.id);
  programInput.addEventListener('input', renderUsers);
  document.getElementById('adminUserId').setAttribute('list', userList.id);
  renderUsers();
}

function adminFieldGroup(id, heading, fields) {
  const group = document.createElement('section'); group.id = id; group.className = 'admin-card';
  const title = document.createElement('h4'); title.textContent = heading; group.append(title);
  fields.forEach(([inputId, labelText, help, required]) => {
    const field = document.createElement('label'); field.className = 'admin-field'; field.htmlFor = inputId;
    const label = document.createElement('span'); label.textContent = labelText + (required ? ' *' : '');
    const input = document.createElement('input'); input.id = inputId; input.type = 'text'; input.placeholder = help; input.required = required;
    const description = document.createElement('small'); description.textContent = help;
    field.append(label, input, description); group.append(field);
  });
  return group;
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
  state.extensions = payload.x && typeof payload.x === 'object' ? structuredClone(payload.x) : {};
  state.original = structuredClone(payload.v);
  state.values = structuredClone(payload.v);
  state.expiresAt = authorization.e;
  const groups = groupedDefinitions();
  state.collapsedOwners = new Set(groups.map(([owner]) => owner));
  state.activeOwner = groups[0]?.[0] || null;
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
    throw new Error(t('invalidLink'));
  } catch (error) {
    showMessage(error.message || String(error), 'error');
  }
}

function collectChangedValues() {
  if (state.values['bumping.enabled'] === true && (!state.values['bumping.channel'] || state.values['bumping.channel'] === '0')) {
    throw new Error(t('bumpingChannelRequired'));
  }
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
    throw new Error('サーバー構成データの形式が正しくありません。');
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
