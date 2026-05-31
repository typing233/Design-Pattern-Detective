const PATTERNS_DATA = [
  {
    id: "singleton",
    name: "单例模式",
    nameEn: "Singleton",
    category: "创建型",
    difficulty: 1,
    description:
      "单例模式确保一个类只有一个实例，并提供一个全局访问点。它适用于需要全局唯一对象的场景，如配置管理器、日志记录器、数据库连接池等。单例模式通过将构造函数私有化，控制实例的创建过程，避免重复实例化带来的资源浪费。",
    keyPoints: [
      "确保全局只有一个实例",
      "提供全局访问点",
      "延迟初始化（懒加载）",
    ],
    examples: [
      {
        title: "基础单例 - 配置管理器",
        difficulty: 1,
        code: `class ConfigManager {
  constructor() {
    if (ConfigManager.instance) {
      return ConfigManager.instance;
    }
    this.config = {};
    ConfigManager.instance = this;
  }

  set(key, value) {
    this.config[key] = value;
  }

  get(key) {
    return this.config[key];
  }
}

const config1 = new ConfigManager();
const config2 = new ConfigManager();
config1.set('theme', 'dark');
console.log(config2.get('theme')); // 'dark'
console.log(config1 === config2); // true`,
      },
      {
        title: "闭包实现单例 - 数据库连接",
        difficulty: 1,
        code: `const Database = (() => {
  let instance = null;

  class DatabaseConnection {
    constructor(url) {
      this.url = url;
      this.connected = false;
    }

    connect() {
      this.connected = true;
      console.log(\`Connected to \${this.url}\`);
    }

    query(sql) {
      if (!this.connected) throw new Error('Not connected');
      return \`Executing: \${sql}\`;
    }
  }

  return {
    getInstance(url) {
      if (!instance) {
        instance = new DatabaseConnection(url);
        instance.connect();
      }
      return instance;
    }
  };
})();

const db1 = Database.getInstance('mongodb://localhost');
const db2 = Database.getInstance('mongodb://other-host');
console.log(db1 === db2); // true`,
      },
    ],
  },
  {
    id: "factory",
    name: "工厂模式",
    nameEn: "Factory Method",
    category: "创建型",
    difficulty: 1,
    description:
      "工厂模式定义一个创建对象的接口，让子类决定实例化哪一个类。它将对象的创建逻辑封装在工厂方法中，使代码不依赖于具体类的构造函数，提高了灵活性和可扩展性。当新增产品类型时，只需添加对应的工厂方法，无需修改已有代码。",
    keyPoints: [
      "将对象创建逻辑封装",
      "通过参数决定创建哪种对象",
      "符合开放-封闭原则",
    ],
    examples: [
      {
        title: "简单工厂 - UI组件创建",
        difficulty: 1,
        code: `class Button {
  constructor(text) {
    this.text = text;
    this.type = 'button';
  }
  render() { return \`<button>\${this.text}</button>\`; }
}

class Input {
  constructor(placeholder) {
    this.placeholder = placeholder;
    this.type = 'input';
  }
  render() { return \`<input placeholder="\${this.placeholder}" />\`; }
}

class Select {
  constructor(options) {
    this.options = options;
    this.type = 'select';
  }
  render() {
    const opts = this.options.map(o => \`<option>\${o}</option>\`).join('');
    return \`<select>\${opts}</select>\`;
  }
}

class UIFactory {
  static create(type, config) {
    switch (type) {
      case 'button': return new Button(config.text);
      case 'input': return new Input(config.placeholder);
      case 'select': return new Select(config.options);
      default: throw new Error(\`Unknown type: \${type}\`);
    }
  }
}

const btn = UIFactory.create('button', { text: '提交' });
const input = UIFactory.create('input', { placeholder: '请输入...' });
console.log(btn.render());`,
      },
      {
        title: "工厂方法 - 通知系统",
        difficulty: 1,
        code: `class Notification {
  send(message) { throw new Error('Must implement send()'); }
}

class EmailNotification extends Notification {
  send(message) {
    return \`发送邮件: \${message}\`;
  }
}

class SMSNotification extends Notification {
  send(message) {
    return \`发送短信: \${message}\`;
  }
}

class PushNotification extends Notification {
  send(message) {
    return \`推送通知: \${message}\`;
  }
}

class NotificationFactory {
  create(type) {
    const factories = {
      email: () => new EmailNotification(),
      sms: () => new SMSNotification(),
      push: () => new PushNotification(),
    };
    const factory = factories[type];
    if (!factory) throw new Error(\`Unknown: \${type}\`);
    return factory();
  }
}

const factory = new NotificationFactory();
const notifier = factory.create('email');
console.log(notifier.send('你好！'));`,
      },
    ],
  },
  {
    id: "abstract-factory",
    name: "抽象工厂模式",
    nameEn: "Abstract Factory",
    category: "创建型",
    difficulty: 2,
    description:
      "抽象工厂模式提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。它适用于需要创建一组配套产品的场景，确保产品之间的兼容性。",
    keyPoints: [
      "创建一系列相关对象",
      "确保产品族之间的一致性",
      "易于切换产品族",
    ],
    examples: [
      {
        title: "UI主题工厂",
        difficulty: 2,
        code: `class DarkButton {
  render() { return '<button class="dark-btn">Dark Button</button>'; }
}
class DarkInput {
  render() { return '<input class="dark-input" />'; }
}
class LightButton {
  render() { return '<button class="light-btn">Light Button</button>'; }
}
class LightInput {
  render() { return '<input class="light-input" />'; }
}

class DarkThemeFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}

class LightThemeFactory {
  createButton() { return new LightButton(); }
  createInput() { return new LightInput(); }
}

function buildUI(factory) {
  const button = factory.createButton();
  const input = factory.createInput();
  return { button: button.render(), input: input.render() };
}

const darkUI = buildUI(new DarkThemeFactory());
const lightUI = buildUI(new LightThemeFactory());
console.log(darkUI, lightUI);`,
      },
      {
        title: "跨平台组件工厂",
        difficulty: 2,
        code: `class WebDialog {
  show(msg) { return \`[Web弹窗] \${msg}\`; }
}
class WebMenu {
  render(items) { return \`[Web菜单] \${items.join(' | ')}\`; }
}

class MobileDialog {
  show(msg) { return \`[移动端弹窗] \${msg}\`; }
}
class MobileMenu {
  render(items) { return \`[移动端菜单] \${items.join(', ')}\`; }
}

class WebUIFactory {
  createDialog() { return new WebDialog(); }
  createMenu() { return new WebMenu(); }
}

class MobileUIFactory {
  createDialog() { return new MobileDialog(); }
  createMenu() { return new MobileMenu(); }
}

function createApp(factory) {
  const dialog = factory.createDialog();
  const menu = factory.createMenu();
  return {
    alert: (msg) => dialog.show(msg),
    nav: (items) => menu.render(items)
  };
}

const mobileApp = createApp(new MobileUIFactory());
console.log(mobileApp.alert('操作成功'));
console.log(mobileApp.nav(['首页', '设置', '关于']));`,
      },
    ],
  },
  {
    id: "builder",
    name: "建造者模式",
    nameEn: "Builder",
    category: "创建型",
    difficulty: 2,
    description:
      "建造者模式将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。它通过分步骤构建对象，允许用户只通过指定复杂对象的类型和内容就可以构建它们。",
    keyPoints: [
      "分步骤构建复杂对象",
      "链式调用提升可读性",
      "同样的构建过程不同表示",
    ],
    examples: [
      {
        title: "查询构建器",
        difficulty: 2,
        code: `class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.conditions = [];
    this.orderFields = [];
    this.limitCount = null;
    this.selectedFields = ['*'];
  }

  select(...fields) {
    this.selectedFields = fields;
    return this;
  }

  where(condition) {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field, dir = 'ASC') {
    this.orderFields.push(\`\${field} \${dir}\`);
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  build() {
    let sql = \`SELECT \${this.selectedFields.join(', ')} FROM \${this.table}\`;
    if (this.conditions.length) sql += \` WHERE \${this.conditions.join(' AND ')}\`;
    if (this.orderFields.length) sql += \` ORDER BY \${this.orderFields.join(', ')}\`;
    if (this.limitCount) sql += \` LIMIT \${this.limitCount}\`;
    return sql;
  }
}

const query = new QueryBuilder('users')
  .select('name', 'email')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('name')
  .limit(10)
  .build();
console.log(query);`,
      },
      {
        title: "HTTP请求构建器",
        difficulty: 2,
        code: `class RequestBuilder {
  constructor(url) {
    this.url = url;
    this._method = 'GET';
    this._headers = {};
    this._body = null;
    this._timeout = 5000;
  }

  method(m) { this._method = m; return this; }
  header(key, value) { this._headers[key] = value; return this; }
  body(data) { this._body = JSON.stringify(data); return this; }
  timeout(ms) { this._timeout = ms; return this; }

  build() {
    return {
      url: this.url,
      method: this._method,
      headers: this._headers,
      body: this._body,
      timeout: this._timeout
    };
  }
}

const request = new RequestBuilder('/api/users')
  .method('POST')
  .header('Content-Type', 'application/json')
  .header('Authorization', 'Bearer token123')
  .body({ name: '张三', email: 'zhang@example.com' })
  .timeout(3000)
  .build();
console.log(request);`,
      },
    ],
  },
  {
    id: "prototype",
    name: "原型模式",
    nameEn: "Prototype",
    category: "创建型",
    difficulty: 2,
    description:
      "原型模式用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。它通过克隆已有对象来创建新对象，避免了重复的初始化操作，特别适合创建成本较高的对象。",
    keyPoints: [
      "通过克隆创建新对象",
      "避免重复初始化开销",
      "深拷贝与浅拷贝的选择",
    ],
    examples: [
      {
        title: "文档模板克隆",
        difficulty: 2,
        code: `class Document {
  constructor(title, content, styles) {
    this.title = title;
    this.content = content;
    this.styles = { ...styles };
    this.createdAt = new Date();
  }

  clone() {
    const cloned = new Document(this.title, this.content, { ...this.styles });
    cloned.createdAt = new Date();
    return cloned;
  }

  setTitle(title) { this.title = title; return this; }
  setContent(content) { this.content = content; return this; }
}

const template = new Document('报告模板', '# 标题\\n正文内容...', {
  fontSize: '14px',
  fontFamily: 'SimSun',
  margin: '2cm'
});

const report1 = template.clone().setTitle('Q1季度报告');
const report2 = template.clone().setTitle('Q2季度报告');
console.log(report1.title, report1.styles);
console.log(report2.title !== template.title); // true`,
      },
      {
        title: "游戏角色原型",
        difficulty: 2,
        code: `class Character {
  constructor(config) {
    this.name = config.name;
    this.hp = config.hp;
    this.attack = config.attack;
    this.skills = [...(config.skills || [])];
    this.equipment = { ...(config.equipment || {}) };
  }

  clone() {
    return new Character({
      name: this.name,
      hp: this.hp,
      attack: this.attack,
      skills: [...this.skills],
      equipment: { ...this.equipment }
    });
  }
}

const warriorProto = new Character({
  name: '战士',
  hp: 100,
  attack: 25,
  skills: ['重击', '格挡'],
  equipment: { weapon: '长剑', armor: '铁甲' }
});

const warrior1 = warriorProto.clone();
warrior1.name = '战士·阿尔法';
warrior1.skills.push('旋风斩');

const warrior2 = warriorProto.clone();
warrior2.name = '战士·贝塔';

console.log(warrior1.skills); // ['重击', '格挡', '旋风斩']
console.log(warrior2.skills); // ['重击', '格挡']
console.log(warriorProto.skills); // ['重击', '格挡']`,
      },
    ],
  },
  {
    id: "observer",
    name: "观察者模式",
    nameEn: "Observer",
    category: "行为型",
    difficulty: 1,
    description:
      "观察者模式定义了对象之间的一对多依赖关系，当一个对象状态改变时，所有依赖于它的对象都会收到通知并自动更新。它实现了发布-订阅机制，使得对象之间松耦合通信。",
    keyPoints: [
      "一对多的依赖关系",
      "自动通知所有观察者",
      "发布者与订阅者松耦合",
    ],
    examples: [
      {
        title: "事件总线",
        difficulty: 1,
        code: `class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => cb(data));
  }
}

const bus = new EventBus();

bus.on('userLogin', (user) => {
  console.log(\`欢迎回来, \${user.name}!\`);
});

bus.on('userLogin', (user) => {
  console.log(\`记录登录日志: \${user.name} at \${new Date().toLocaleString()}\`);
});

bus.emit('userLogin', { name: '张三', id: 1 });`,
      },
      {
        title: "响应式数据绑定",
        difficulty: 2,
        code: `class Reactive {
  constructor(initialValue) {
    this._value = initialValue;
    this._watchers = [];
  }

  get value() { return this._value; }

  set value(newVal) {
    const oldVal = this._value;
    if (oldVal === newVal) return;
    this._value = newVal;
    this._watchers.forEach(fn => fn(newVal, oldVal));
  }

  watch(fn) {
    this._watchers.push(fn);
    return () => {
      this._watchers = this._watchers.filter(w => w !== fn);
    };
  }
}

const temperature = new Reactive(20);

temperature.watch((newVal, oldVal) => {
  console.log(\`温度变化: \${oldVal}°C -> \${newVal}°C\`);
});

temperature.watch((val) => {
  if (val > 30) console.log('警告: 温度过高!');
});

temperature.value = 25;
temperature.value = 35;`,
      },
    ],
  },
  {
    id: "strategy",
    name: "策略模式",
    nameEn: "Strategy",
    category: "行为型",
    difficulty: 1,
    description:
      "策略模式定义了一系列算法，把它们一个个封装起来，并且使它们可以互相替换。策略模式让算法独立于使用它的客户端而变化，适用于需要在运行时选择不同算法的场景。",
    keyPoints: [
      "封装可互换的算法",
      "消除大量条件分支",
      "运行时动态切换策略",
    ],
    examples: [
      {
        title: "表单验证策略",
        difficulty: 1,
        code: `const validators = {
  required: (value) => ({
    valid: value.trim().length > 0,
    message: '此字段为必填项'
  }),
  email: (value) => ({
    valid: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
    message: '请输入有效的邮箱地址'
  }),
  minLength: (min) => (value) => ({
    valid: value.length >= min,
    message: \`最少需要 \${min} 个字符\`
  }),
  phone: (value) => ({
    valid: /^1[3-9]\\d{9}$/.test(value),
    message: '请输入有效的手机号码'
  })
};

class FormValidator {
  constructor() {
    this.rules = {};
  }

  addRule(field, ...strategies) {
    this.rules[field] = strategies;
  }

  validate(data) {
    const errors = {};
    for (const [field, strategies] of Object.entries(this.rules)) {
      for (const strategy of strategies) {
        const result = strategy(data[field] || '');
        if (!result.valid) {
          errors[field] = result.message;
          break;
        }
      }
    }
    return { valid: Object.keys(errors).length === 0, errors };
  }
}

const form = new FormValidator();
form.addRule('email', validators.required, validators.email);
form.addRule('password', validators.required, validators.minLength(8));
console.log(form.validate({ email: 'test@x.com', password: '123' }));`,
      },
      {
        title: "排序策略",
        difficulty: 1,
        code: `class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    return this.strategy.sort([...data]);
  }
}

const byPrice = {
  sort: (items) => items.sort((a, b) => a.price - b.price)
};

const byName = {
  sort: (items) => items.sort((a, b) => a.name.localeCompare(b.name))
};

const byRating = {
  sort: (items) => items.sort((a, b) => b.rating - a.rating)
};

const products = [
  { name: '键盘', price: 299, rating: 4.5 },
  { name: '鼠标', price: 99, rating: 4.8 },
  { name: '显示器', price: 1999, rating: 4.2 }
];

const sorter = new Sorter(byPrice);
console.log(sorter.sort(products).map(p => p.name));

sorter.setStrategy(byRating);
console.log(sorter.sort(products).map(p => p.name));`,
      },
    ],
  },
  {
    id: "decorator",
    name: "装饰器模式",
    nameEn: "Decorator",
    category: "结构型",
    difficulty: 2,
    description:
      "装饰器模式动态地给一个对象添加一些额外的职责。就增加功能而言，装饰器模式比生成子类更为灵活。它通过将对象包装在装饰器对象中，以透明的方式扩展对象的功能。",
    keyPoints: [
      "动态添加功能",
      "不修改原有对象",
      "可以叠加多个装饰器",
    ],
    examples: [
      {
        title: "日志装饰器",
        difficulty: 2,
        code: `function withLogging(fn, label) {
  return function(...args) {
    console.log(\`[\${label}] 调用参数:\`, args);
    const start = Date.now();
    const result = fn.apply(this, args);
    const duration = Date.now() - start;
    console.log(\`[\${label}] 返回值:\`, result, \`耗时: \${duration}ms\`);
    return result;
  };
}

function withCache(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('[Cache] 命中缓存');
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const enhancedFib = withLogging(withCache(fibonacci), 'Fibonacci');
enhancedFib(10);
enhancedFib(10); // 命中缓存`,
      },
      {
        title: "HTTP客户端装饰",
        difficulty: 2,
        code: `class BasicHTTPClient {
  async request(url, options = {}) {
    return { url, ...options, timestamp: Date.now() };
  }
}

class AuthDecorator {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }
  async request(url, options = {}) {
    options.headers = { ...options.headers, Authorization: \`Bearer \${this.token}\` };
    return this.client.request(url, options);
  }
}

class RetryDecorator {
  constructor(client, maxRetries = 3) {
    this.client = client;
    this.maxRetries = maxRetries;
  }
  async request(url, options = {}) {
    for (let i = 0; i <= this.maxRetries; i++) {
      try {
        return await this.client.request(url, options);
      } catch (e) {
        if (i === this.maxRetries) throw e;
        console.log(\`重试第 \${i + 1} 次...\`);
      }
    }
  }
}

let client = new BasicHTTPClient();
client = new AuthDecorator(client, 'my-token');
client = new RetryDecorator(client, 2);

client.request('/api/data').then(console.log);`,
      },
    ],
  },
  {
    id: "adapter",
    name: "适配器模式",
    nameEn: "Adapter",
    category: "结构型",
    difficulty: 2,
    description:
      "适配器模式将一个类的接口转换成客户希望的另外一个接口。它使得原本由于接口不兼容而不能一起工作的那些类可以一起工作，就像现实中的电源适配器一样。",
    keyPoints: [
      "转换不兼容的接口",
      "不修改现有代码",
      "新旧系统无缝对接",
    ],
    examples: [
      {
        title: "旧API适配新接口",
        difficulty: 2,
        code: `class OldUserService {
  getUser(id) {
    return {
      user_id: id,
      first_name: '张',
      last_name: '三',
      email_address: 'zhang@example.com',
      phone_number: '13800138000',
      created_time: '2024-01-01'
    };
  }
}

class UserAdapter {
  constructor(oldService) {
    this.oldService = oldService;
  }

  getUserById(id) {
    const legacy = this.oldService.getUser(id);
    return {
      id: legacy.user_id,
      name: \`\${legacy.first_name}\${legacy.last_name}\`,
      email: legacy.email_address,
      phone: legacy.phone_number,
      createdAt: legacy.created_time
    };
  }
}

const adapter = new UserAdapter(new OldUserService());
const user = adapter.getUserById(1);
console.log(user);
// { id: 1, name: '张三', email: '...', phone: '...', createdAt: '...' }`,
      },
      {
        title: "第三方库适配",
        difficulty: 2,
        code: `class ThirdPartyLogger {
  writeLog(level, timestamp, msg) {
    return \`[\${level}] \${timestamp}: \${msg}\`;
  }
}

class LoggerAdapter {
  constructor() {
    this.logger = new ThirdPartyLogger();
  }

  info(message) {
    return this.logger.writeLog('INFO', new Date().toISOString(), message);
  }

  warn(message) {
    return this.logger.writeLog('WARN', new Date().toISOString(), message);
  }

  error(message) {
    return this.logger.writeLog('ERROR', new Date().toISOString(), message);
  }
}

const logger = new LoggerAdapter();
console.log(logger.info('用户登录成功'));
console.log(logger.error('数据库连接失败'));`,
      },
    ],
  },
  {
    id: "facade",
    name: "外观模式",
    nameEn: "Facade",
    category: "结构型",
    difficulty: 2,
    description:
      "外观模式为子系统中的一组接口提供一个统一的高层接口。它定义了一个更高层次的接口，使得子系统更加容易使用，隐藏了系统的复杂性。",
    keyPoints: [
      "简化复杂子系统的使用",
      "提供统一的高层接口",
      "降低客户端与子系统的耦合",
    ],
    examples: [
      {
        title: "多媒体播放器外观",
        difficulty: 2,
        code: `class AudioDecoder {
  decode(file) { return \`解码音频: \${file}\`; }
}

class VideoDecoder {
  decode(file) { return \`解码视频: \${file}\`; }
}

class SubtitleParser {
  parse(file) { return \`加载字幕: \${file}\`; }
}

class Display {
  render(data) { return \`渲染画面: \${data}\`; }
}

class Speaker {
  play(data) { return \`播放音频: \${data}\`; }
}

class MediaPlayerFacade {
  constructor() {
    this.audio = new AudioDecoder();
    this.video = new VideoDecoder();
    this.subtitle = new SubtitleParser();
    this.display = new Display();
    this.speaker = new Speaker();
  }

  playMovie(movieFile, subtitleFile) {
    const results = [];
    results.push(this.video.decode(movieFile));
    results.push(this.audio.decode(movieFile));
    results.push(this.subtitle.parse(subtitleFile));
    results.push(this.display.render('视频帧'));
    results.push(this.speaker.play('音频流'));
    return results;
  }
}

const player = new MediaPlayerFacade();
const output = player.playMovie('movie.mp4', 'movie.srt');
output.forEach(line => console.log(line));`,
      },
      {
        title: "电商下单外观",
        difficulty: 2,
        code: `class Inventory {
  check(productId) { return { available: true, stock: 50 }; }
}

class Payment {
  charge(userId, amount) { return { success: true, transactionId: 'TXN001' }; }
}

class Shipping {
  createOrder(address, items) { return { trackingNo: 'SF001', eta: '3天' }; }
}

class Notification {
  sendEmail(userId, message) { return \`邮件已发送: \${message}\`; }
}

class OrderFacade {
  constructor() {
    this.inventory = new Inventory();
    this.payment = new Payment();
    this.shipping = new Shipping();
    this.notification = new Notification();
  }

  placeOrder(userId, productId, address, amount) {
    const stock = this.inventory.check(productId);
    if (!stock.available) return { success: false, reason: '库存不足' };

    const payment = this.payment.charge(userId, amount);
    if (!payment.success) return { success: false, reason: '支付失败' };

    const shipping = this.shipping.createOrder(address, [productId]);
    this.notification.sendEmail(userId, \`订单已发货，运单号: \${shipping.trackingNo}\`);

    return { success: true, trackingNo: shipping.trackingNo, eta: shipping.eta };
  }
}

const order = new OrderFacade();
console.log(order.placeOrder('U001', 'P100', '北京市...', 299));`,
      },
    ],
  },
  {
    id: "proxy",
    name: "代理模式",
    nameEn: "Proxy",
    category: "结构型",
    difficulty: 2,
    description:
      "代理模式为其他对象提供一种代理以控制对这个对象的访问。它在不改变目标对象的前提下，通过代理对象来增加额外的控制逻辑，如访问控制、缓存、延迟加载等。",
    keyPoints: [
      "控制对原对象的访问",
      "透明代理，接口一致",
      "可用于缓存、权限、懒加载",
    ],
    examples: [
      {
        title: "缓存代理",
        difficulty: 2,
        code: `class HeavyComputation {
  calculate(n) {
    let result = 0;
    for (let i = 0; i < n * 1000000; i++) {
      result += Math.random();
    }
    return Math.round(result);
  }
}

class CacheProxy {
  constructor(target) {
    this.target = target;
    this.cache = new Map();
  }

  calculate(n) {
    if (this.cache.has(n)) {
      console.log(\`[缓存命中] n=\${n}\`);
      return this.cache.get(n);
    }
    console.log(\`[计算中] n=\${n}\`);
    const result = this.target.calculate(n);
    this.cache.set(n, result);
    return result;
  }
}

const computation = new CacheProxy(new HeavyComputation());
console.log(computation.calculate(5)); // 计算
console.log(computation.calculate(5)); // 缓存命中
console.log(computation.calculate(3)); // 计算`,
      },
      {
        title: "访问控制代理",
        difficulty: 3,
        code: `class DataService {
  getData(key) { return \`数据[\${key}]的内容\`; }
  setData(key, value) { return \`已保存: \${key}=\${value}\`; }
  deleteData(key) { return \`已删除: \${key}\`; }
}

class AccessProxy {
  constructor(service, userRole) {
    this.service = service;
    this.userRole = userRole;
    this.permissions = {
      guest: ['getData'],
      user: ['getData', 'setData'],
      admin: ['getData', 'setData', 'deleteData']
    };
  }

  _checkPermission(method) {
    const allowed = this.permissions[this.userRole] || [];
    if (!allowed.includes(method)) {
      throw new Error(\`权限不足: \${this.userRole} 无法执行 \${method}\`);
    }
  }

  getData(key) {
    this._checkPermission('getData');
    return this.service.getData(key);
  }

  setData(key, value) {
    this._checkPermission('setData');
    return this.service.setData(key, value);
  }

  deleteData(key) {
    this._checkPermission('deleteData');
    return this.service.deleteData(key);
  }
}

const guestProxy = new AccessProxy(new DataService(), 'guest');
console.log(guestProxy.getData('config'));
try { guestProxy.setData('x', '1'); } catch(e) { console.log(e.message); }`,
      },
    ],
  },
  {
    id: "command",
    name: "命令模式",
    nameEn: "Command",
    category: "行为型",
    difficulty: 3,
    description:
      "命令模式将一个请求封装为一个对象，从而使你可以用不同的请求对客户进行参数化、对请求排队或记录请求日志，以及支持可撤销的操作。",
    keyPoints: [
      "将操作封装为对象",
      "支持撤销/重做",
      "解耦调用者与执行者",
    ],
    examples: [
      {
        title: "文本编辑器撤销/重做",
        difficulty: 3,
        code: `class TextEditor {
  constructor() { this.content = ''; }
  insert(text, position) {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
  }
  delete(position, length) {
    const deleted = this.content.slice(position, position + length);
    this.content = this.content.slice(0, position) + this.content.slice(position + length);
    return deleted;
  }
  getContent() { return this.content; }
}

class InsertCommand {
  constructor(editor, text, position) {
    this.editor = editor;
    this.text = text;
    this.position = position;
  }
  execute() { this.editor.insert(this.text, this.position); }
  undo() { this.editor.delete(this.position, this.text.length); }
}

class CommandHistory {
  constructor() { this.history = []; this.pointer = -1; }
  execute(command) {
    this.history = this.history.slice(0, this.pointer + 1);
    command.execute();
    this.history.push(command);
    this.pointer++;
  }
  undo() {
    if (this.pointer < 0) return;
    this.history[this.pointer].undo();
    this.pointer--;
  }
  redo() {
    if (this.pointer >= this.history.length - 1) return;
    this.pointer++;
    this.history[this.pointer].execute();
  }
}

const editor = new TextEditor();
const history = new CommandHistory();
history.execute(new InsertCommand(editor, 'Hello', 0));
history.execute(new InsertCommand(editor, ' World', 5));
console.log(editor.getContent()); // 'Hello World'
history.undo();
console.log(editor.getContent()); // 'Hello'
history.redo();
console.log(editor.getContent()); // 'Hello World'`,
      },
      {
        title: "任务队列",
        difficulty: 3,
        code: `class TaskQueue {
  constructor() { this.queue = []; this.isRunning = false; }

  addTask(command) {
    this.queue.push(command);
    if (!this.isRunning) this.run();
  }

  async run() {
    this.isRunning = true;
    while (this.queue.length > 0) {
      const command = this.queue.shift();
      console.log(\`执行任务: \${command.name}\`);
      await command.execute();
    }
    this.isRunning = false;
  }
}

class DownloadCommand {
  constructor(url) {
    this.name = \`下载 \${url}\`;
    this.url = url;
  }
  execute() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(\`  完成下载: \${this.url}\`);
        resolve();
      }, 100);
    });
  }
}

class ProcessCommand {
  constructor(filename) {
    this.name = \`处理 \${filename}\`;
    this.filename = filename;
  }
  execute() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(\`  处理完成: \${this.filename}\`);
        resolve();
      }, 50);
    });
  }
}

const queue = new TaskQueue();
queue.addTask(new DownloadCommand('file1.zip'));
queue.addTask(new ProcessCommand('file1.zip'));
queue.addTask(new DownloadCommand('file2.zip'));`,
      },
    ],
  },
  {
    id: "iterator",
    name: "迭代器模式",
    nameEn: "Iterator",
    category: "行为型",
    difficulty: 2,
    description:
      "迭代器模式提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。它使得遍历集合的方式统一化，支持不同的遍历策略。",
    keyPoints: [
      "统一遍历接口",
      "不暴露集合内部结构",
      "支持多种遍历方式",
    ],
    examples: [
      {
        title: "范围迭代器",
        difficulty: 2,
        code: `class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    const step = this.step;

    return {
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { done: true };
      }
    };
  }
}

const range = new Range(1, 10, 2);
for (const num of range) {
  console.log(num); // 1, 3, 5, 7, 9
}

console.log([...new Range(0, 5)]); // [0, 1, 2, 3, 4, 5]`,
      },
      {
        title: "树结构深度优先迭代",
        difficulty: 3,
        code: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  addChild(node) { this.children.push(node); return this; }
}

class DepthFirstIterator {
  constructor(root) {
    this.stack = [root];
  }

  [Symbol.iterator]() { return this; }

  next() {
    if (this.stack.length === 0) return { done: true };
    const node = this.stack.pop();
    for (let i = node.children.length - 1; i >= 0; i--) {
      this.stack.push(node.children[i]);
    }
    return { value: node.value, done: false };
  }
}

const root = new TreeNode('CEO');
const cto = new TreeNode('CTO').addChild(new TreeNode('前端')).addChild(new TreeNode('后端'));
const cfo = new TreeNode('CFO').addChild(new TreeNode('财务'));
root.addChild(cto).addChild(cfo);

const iterator = new DepthFirstIterator(root);
for (const value of iterator) {
  console.log(value);
}
// CEO, CTO, 前端, 后端, CFO, 财务`,
      },
    ],
  },
  {
    id: "state",
    name: "状态模式",
    nameEn: "State",
    category: "行为型",
    difficulty: 3,
    description:
      "状态模式允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类。它将状态相关的行为封装在独立的状态类中，使状态转换逻辑更清晰。",
    keyPoints: [
      "将状态行为封装在独立类中",
      "状态转换逻辑清晰",
      "消除大量条件判断",
    ],
    examples: [
      {
        title: "订单状态机",
        difficulty: 3,
        code: `class OrderState {
  constructor(order) { this.order = order; }
  pay() { throw new Error('当前状态不支持此操作'); }
  ship() { throw new Error('当前状态不支持此操作'); }
  deliver() { throw new Error('当前状态不支持此操作'); }
  cancel() { throw new Error('当前状态不支持此操作'); }
}

class PendingState extends OrderState {
  pay() {
    console.log('支付成功');
    this.order.setState(new PaidState(this.order));
  }
  cancel() {
    console.log('订单已取消');
    this.order.setState(new CancelledState(this.order));
  }
}

class PaidState extends OrderState {
  ship() {
    console.log('已发货');
    this.order.setState(new ShippedState(this.order));
  }
}

class ShippedState extends OrderState {
  deliver() {
    console.log('已签收');
    this.order.setState(new DeliveredState(this.order));
  }
}

class DeliveredState extends OrderState {}
class CancelledState extends OrderState {}

class Order {
  constructor() { this.state = new PendingState(this); }
  setState(state) { this.state = state; }
  pay() { this.state.pay(); }
  ship() { this.state.ship(); }
  deliver() { this.state.deliver(); }
  cancel() { this.state.cancel(); }
}

const order = new Order();
order.pay();    // 支付成功
order.ship();   // 已发货
order.deliver();// 已签收
try { order.pay(); } catch(e) { console.log(e.message); }`,
      },
      {
        title: "交通灯状态",
        difficulty: 3,
        code: `class TrafficLight {
  constructor() {
    this.states = {
      red: { color: '红灯', duration: 5000, next: 'green', action: '禁止通行' },
      green: { color: '绿灯', duration: 4000, next: 'yellow', action: '允许通行' },
      yellow: { color: '黄灯', duration: 1500, next: 'red', action: '准备停车' }
    };
    this.current = 'red';
    this.listeners = [];
  }

  onChange(fn) { this.listeners.push(fn); }

  transition() {
    const state = this.states[this.current];
    this.current = state.next;
    const newState = this.states[this.current];
    this.listeners.forEach(fn => fn(newState));
    return newState;
  }

  getStatus() {
    return this.states[this.current];
  }
}

const light = new TrafficLight();
light.onChange((state) => {
  console.log(\`切换到: \${state.color} - \${state.action}\`);
});

light.transition(); // 切换到: 绿灯 - 允许通行
light.transition(); // 切换到: 黄灯 - 准备停车
light.transition(); // 切换到: 红灯 - 禁止通行`,
      },
    ],
  },
  {
    id: "mediator",
    name: "中介者模式",
    nameEn: "Mediator",
    category: "行为型",
    difficulty: 3,
    description:
      "中介者模式用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。",
    keyPoints: [
      "集中管理对象间通信",
      "减少对象间直接依赖",
      "简化多对多交互为一对多",
    ],
    examples: [
      {
        title: "聊天室中介者",
        difficulty: 3,
        code: `class ChatRoom {
  constructor(name) {
    this.name = name;
    this.users = new Map();
    this.messages = [];
  }

  join(user) {
    this.users.set(user.name, user);
    user.room = this;
    this.broadcast(\`[系统] \${user.name} 加入了聊天室\`, user);
  }

  leave(user) {
    this.users.delete(user.name);
    this.broadcast(\`[系统] \${user.name} 离开了聊天室\`, user);
  }

  sendMessage(message, sender, receiver) {
    const msg = { from: sender.name, text: message, time: new Date().toLocaleTimeString() };
    this.messages.push(msg);
    if (receiver) {
      const target = this.users.get(receiver);
      if (target) target.receive(msg);
    } else {
      this.broadcast(message, sender);
    }
  }

  broadcast(message, sender) {
    this.users.forEach((user) => {
      if (user !== sender) user.receive({ from: sender?.name || '系统', text: message });
    });
  }
}

class User {
  constructor(name) { this.name = name; this.room = null; this.inbox = []; }
  send(message, to) { this.room.sendMessage(message, this, to); }
  receive(msg) {
    this.inbox.push(msg);
    console.log(\`[\${this.name}] 收到来自 \${msg.from}: \${msg.text}\`);
  }
}

const room = new ChatRoom('技术讨论');
const alice = new User('Alice');
const bob = new User('Bob');
room.join(alice);
room.join(bob);
alice.send('大家好!');
bob.send('你好Alice!', 'Alice');`,
      },
      {
        title: "表单组件中介",
        difficulty: 3,
        code: `class FormMediator {
  constructor() {
    this.components = {};
    this.rules = [];
  }

  register(name, component) {
    this.components[name] = component;
    component.mediator = this;
  }

  addRule(rule) { this.rules.push(rule); }

  notify(sender, event, data) {
    this.rules.forEach(rule => {
      if (rule.when(sender, event, data)) {
        rule.then(this.components, data);
      }
    });
  }
}

class FormField {
  constructor(name, value = '') {
    this.name = name;
    this.value = value;
    this.disabled = false;
    this.mediator = null;
  }
  setValue(val) {
    this.value = val;
    if (this.mediator) this.mediator.notify(this.name, 'change', val);
  }
  setDisabled(flag) { this.disabled = flag; }
}

const mediator = new FormMediator();
const country = new FormField('country');
const city = new FormField('city');
const submitBtn = new FormField('submit');

mediator.register('country', country);
mediator.register('city', city);
mediator.register('submit', submitBtn);

mediator.addRule({
  when: (sender, event) => sender === 'country' && event === 'change',
  then: (components, value) => {
    console.log(\`国家变更为: \${value}，重置城市选项\`);
    components.city.setValue('');
  }
});

mediator.addRule({
  when: (sender, event) => event === 'change',
  then: (components) => {
    const ready = components.country.value && components.city.value;
    components.submit.setDisabled(!ready);
    console.log(\`提交按钮: \${ready ? '可用' : '禁用'}\`);
  }
});

country.setValue('中国');
city.setValue('北京');`,
      },
    ],
  },
];
