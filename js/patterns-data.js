const PATTERNS_DATA = [
  {
    id: "singleton",
    name: "单例模式",
    nameEn: "Singleton",
    category: "创建型",
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
console.log(db1 === db2); // true
console.log(db2.url); // 'mongodb://localhost'`,
      },
    ],
  },
  {
    id: "factory",
    name: "工厂模式",
    nameEn: "Factory Method",
    category: "创建型",
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
        code: `class Button {
  constructor(text) {
    this.text = text;
    this.type = 'button';
  }
  render() {
    return \`<button>\${this.text}</button>\`;
  }
}

class Input {
  constructor(placeholder) {
    this.placeholder = placeholder;
    this.type = 'input';
  }
  render() {
    return \`<input placeholder="\${this.placeholder}" />\`;
  }
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
const input = UIFactory.create('input', { placeholder: '请输入' });
console.log(btn.render());
console.log(input.render());`,
      },
      {
        title: "工厂方法 - 物流运输",
        code: `class Transport {
  deliver() {
    throw new Error('Must implement deliver()');
  }
}

class Truck extends Transport {
  deliver() {
    return '通过陆运卡车配送货物';
  }
}

class Ship extends Transport {
  deliver() {
    return '通过海运轮船配送货物';
  }
}

class Airplane extends Transport {
  deliver() {
    return '通过空运飞机配送货物';
  }
}

class LogisticsFactory {
  createTransport(distance) {
    if (distance < 500) return new Truck();
    if (distance < 5000) return new Ship();
    return new Airplane();
  }
}

const logistics = new LogisticsFactory();
const t1 = logistics.createTransport(100);
const t2 = logistics.createTransport(3000);
console.log(t1.deliver()); // 陆运
console.log(t2.deliver()); // 海运`,
      },
    ],
  },
  {
    id: "abstract-factory",
    name: "抽象工厂模式",
    nameEn: "Abstract Factory",
    category: "创建型",
    description:
      "抽象工厂模式提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们的具体类。它用于生产'产品族'，确保同一族的产品之间相互兼容。例如跨平台UI框架中，不同平台有不同的按钮、输入框实现，但同一平台的组件风格统一。",
    keyPoints: [
      "创建一系列相关对象",
      "保证产品族的一致性",
      "切换整个产品族只需更换工厂",
    ],
    examples: [
      {
        title: "跨平台UI工厂",
        code: `class MacButton {
  render() { return '[Mac风格按钮]'; }
}

class MacCheckbox {
  render() { return '[Mac风格复选框]'; }
}

class WindowsButton {
  render() { return '[Windows风格按钮]'; }
}

class WindowsCheckbox {
  render() { return '[Windows风格复选框]'; }
}

class MacUIFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
}

class WindowsUIFactory {
  createButton() { return new WindowsButton(); }
  createCheckbox() { return new WindowsCheckbox(); }
}

function renderApp(factory) {
  const button = factory.createButton();
  const checkbox = factory.createCheckbox();
  return button.render() + ' ' + checkbox.render();
}

const platform = 'mac';
const factory = platform === 'mac' ? new MacUIFactory() : new WindowsUIFactory();
console.log(renderApp(factory));`,
      },
      {
        title: "数据库驱动抽象工厂",
        code: `class MySQLConnection {
  connect() { return 'MySQL连接已建立'; }
}

class MySQLQuery {
  execute(sql) { return \`MySQL执行: \${sql}\`; }
}

class PostgreSQLConnection {
  connect() { return 'PostgreSQL连接已建立'; }
}

class PostgreSQLQuery {
  execute(sql) { return \`PostgreSQL执行: \${sql}\`; }
}

class MySQLFactory {
  createConnection() { return new MySQLConnection(); }
  createQuery() { return new MySQLQuery(); }
}

class PostgreSQLFactory {
  createConnection() { return new PostgreSQLConnection(); }
  createQuery() { return new PostgreSQLQuery(); }
}

function initDatabase(factory) {
  const conn = factory.createConnection();
  const query = factory.createQuery();
  console.log(conn.connect());
  console.log(query.execute('SELECT * FROM users'));
}

initDatabase(new PostgreSQLFactory());`,
      },
    ],
  },
  {
    id: "builder",
    name: "建造者模式",
    nameEn: "Builder",
    category: "创建型",
    description:
      "建造者模式将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。它适用于需要生成的对象有复杂的内部结构，且构建步骤可能不同的场景。通过链式调用，使对象的创建过程更加清晰和灵活。",
    keyPoints: [
      "分步骤构建复杂对象",
      "相同构建过程可产生不同结果",
      "链式调用提升可读性",
    ],
    examples: [
      {
        title: "查询构建器",
        code: `class QueryBuilder {
  constructor() {
    this.table = '';
    this.conditions = [];
    this.orderFields = [];
    this.limitCount = null;
  }

  from(table) {
    this.table = table;
    return this;
  }

  where(condition) {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field, direction = 'ASC') {
    this.orderFields.push(\`\${field} \${direction}\`);
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  build() {
    let sql = \`SELECT * FROM \${this.table}\`;
    if (this.conditions.length) {
      sql += \` WHERE \${this.conditions.join(' AND ')}\`;
    }
    if (this.orderFields.length) {
      sql += \` ORDER BY \${this.orderFields.join(', ')}\`;
    }
    if (this.limitCount) {
      sql += \` LIMIT \${this.limitCount}\`;
    }
    return sql;
  }
}

const query = new QueryBuilder()
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('name')
  .limit(10)
  .build();

console.log(query);`,
      },
      {
        title: "HTML文档构建器",
        code: `class HtmlBuilder {
  constructor() {
    this.title = '';
    this.styles = [];
    this.bodyElements = [];
    this.scripts = [];
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  addStyle(css) {
    this.styles.push(css);
    return this;
  }

  addElement(tag, content, attrs = {}) {
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => \`\${k}="\${v}"\`)
      .join(' ');
    this.bodyElements.push(\`<\${tag} \${attrStr}>\${content}</\${tag}>\`);
    return this;
  }

  addScript(src) {
    this.scripts.push(src);
    return this;
  }

  build() {
    return \`<!DOCTYPE html>
<html>
<head><title>\${this.title}</title>
<style>\${this.styles.join('\\n')}</style></head>
<body>\${this.bodyElements.join('\\n')}
\${this.scripts.map(s => \`<script src="\${s}"></script>\`).join('\\n')}
</body></html>\`;
  }
}

const page = new HtmlBuilder()
  .setTitle('我的页面')
  .addStyle('body { margin: 0; }')
  .addElement('h1', '欢迎', { class: 'title' })
  .addElement('p', '这是一个示例页面')
  .addScript('app.js')
  .build();

console.log(page);`,
      },
    ],
  },
  {
    id: "prototype",
    name: "原型模式",
    nameEn: "Prototype",
    category: "创建型",
    description:
      "原型模式通过复制一个已有对象来创建新对象，而不是通过类来实例化。它利用已有实例作为原型，通过克隆来创建新对象，避免了重复的初始化操作。JavaScript天然支持原型模式，因为所有对象都有原型链，Object.create() 是其核心实现。",
    keyPoints: [
      "通过克隆已有对象创建新对象",
      "避免重复初始化开销",
      "注意深拷贝与浅拷贝的区别",
    ],
    examples: [
      {
        title: "游戏角色原型克隆",
        code: `class Character {
  constructor(name, hp, attack, skills) {
    this.name = name;
    this.hp = hp;
    this.attack = attack;
    this.skills = skills;
  }

  clone() {
    return new Character(
      this.name,
      this.hp,
      this.attack,
      [...this.skills]
    );
  }

  toString() {
    return \`\${this.name} [HP:\${this.hp} ATK:\${this.attack}]\`;
  }
}

const warrior = new Character('战士', 100, 25, ['重击', '防御']);
const warrior2 = warrior.clone();
warrior2.name = '精英战士';
warrior2.hp = 150;
warrior2.skills.push('旋风斩');

console.log(warrior.toString());
console.log(warrior2.toString());
console.log(warrior.skills);  // ['重击', '防御']
console.log(warrior2.skills); // ['重击', '防御', '旋风斩']`,
      },
      {
        title: "配置模板原型",
        code: `const configPrototype = {
  server: { host: 'localhost', port: 3000 },
  database: { host: 'localhost', port: 5432, name: 'mydb' },
  cache: { ttl: 3600, maxSize: 100 },

  clone() {
    return JSON.parse(JSON.stringify(this));
  }
};

function createEnvConfig(env) {
  const config = configPrototype.clone();

  if (env === 'production') {
    config.server.host = '0.0.0.0';
    config.server.port = 80;
    config.database.host = 'db.prod.internal';
    config.cache.ttl = 7200;
  } else if (env === 'test') {
    config.database.name = 'mydb_test';
    config.cache.ttl = 0;
  }

  return config;
}

const prodConfig = createEnvConfig('production');
const testConfig = createEnvConfig('test');
console.log(prodConfig.server); // { host: '0.0.0.0', port: 80 }
console.log(testConfig.database.name); // 'mydb_test'`,
      },
    ],
  },
  {
    id: "observer",
    name: "观察者模式",
    nameEn: "Observer",
    category: "行为型",
    description:
      "观察者模式定义了对象之间的一对多依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都会自动收到通知并更新。它是事件驱动编程的基础，广泛应用于UI事件系统、消息队列、发布-订阅系统等场景。",
    keyPoints: [
      "一对多的依赖关系",
      "主题状态变化自动通知观察者",
      "观察者可动态添加和移除",
    ],
    examples: [
      {
        title: "事件总线（EventEmitter）",
        code: `class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event]
        .filter(cb => cb !== callback);
    }
    return this;
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(...args));
    }
  }
}

const bus = new EventEmitter();

bus.on('userLogin', (user) => {
  console.log(\`日志: \${user.name} 登录了\`);
});

bus.on('userLogin', (user) => {
  console.log(\`欢迎回来, \${user.name}!\`);
});

bus.emit('userLogin', { name: '张三', id: 1 });`,
      },
      {
        title: "数据绑定 - 响应式状态",
        code: `class ReactiveState {
  constructor(initialState) {
    this._state = initialState;
    this._watchers = {};
  }

  get(key) {
    return this._state[key];
  }

  set(key, value) {
    const oldValue = this._state[key];
    this._state[key] = value;
    if (oldValue !== value && this._watchers[key]) {
      this._watchers[key].forEach(fn => fn(value, oldValue));
    }
  }

  watch(key, callback) {
    if (!this._watchers[key]) {
      this._watchers[key] = [];
    }
    this._watchers[key].push(callback);
    return () => {
      this._watchers[key] = this._watchers[key].filter(fn => fn !== callback);
    };
  }
}

const state = new ReactiveState({ count: 0, message: 'hello' });

state.watch('count', (newVal, oldVal) => {
  console.log(\`count: \${oldVal} -> \${newVal}\`);
});

state.watch('count', (newVal) => {
  document.title = \`计数: \${newVal}\`;
});

state.set('count', 1);
state.set('count', 2);`,
      },
    ],
  },
  {
    id: "strategy",
    name: "策略模式",
    nameEn: "Strategy",
    category: "行为型",
    description:
      "策略模式定义一系列算法，将每个算法封装起来，并使它们可以互相替换。它让算法的变化独立于使用算法的客户端。适用于有多种处理方式的场景，如表单验证、排序算法选择、支付方式切换等，避免大量的 if-else 分支。",
    keyPoints: [
      "将算法封装为独立的策略对象",
      "策略之间可互相替换",
      "消除条件分支语句",
    ],
    examples: [
      {
        title: "表单验证策略",
        code: `const validators = {
  required(value) {
    return value.trim() !== '' ? '' : '此字段为必填项';
  },
  email(value) {
    const reg = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return reg.test(value) ? '' : '请输入有效的邮箱地址';
  },
  minLength(value, len) {
    return value.length >= len ? '' : \`至少需要\${len}个字符\`;
  },
  phone(value) {
    return /^1[3-9]\\d{9}$/.test(value) ? '' : '请输入有效的手机号';
  }
};

class FormValidator {
  constructor() {
    this.rules = {};
  }

  addRule(field, strategyName, ...params) {
    if (!this.rules[field]) this.rules[field] = [];
    this.rules[field].push({ strategyName, params });
    return this;
  }

  validate(formData) {
    const errors = {};
    for (const [field, rules] of Object.entries(this.rules)) {
      for (const { strategyName, params } of rules) {
        const error = validators[strategyName](formData[field], ...params);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
    return errors;
  }
}

const validator = new FormValidator();
validator
  .addRule('username', 'required')
  .addRule('username', 'minLength', 3)
  .addRule('email', 'required')
  .addRule('email', 'email');

const errors = validator.validate({ username: 'ab', email: 'bad' });
console.log(errors);`,
      },
      {
        title: "价格计算策略",
        code: `const pricingStrategies = {
  normal(price) {
    return price;
  },
  vip(price) {
    return price * 0.8;
  },
  superVip(price) {
    return price * 0.7;
  },
  sale(price, discount) {
    return price * discount;
  },
  coupon(price, amount) {
    return Math.max(0, price - amount);
  }
};

class PriceCalculator {
  constructor(strategy = 'normal') {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  calculate(price, ...params) {
    return pricingStrategies[this.strategy](price, ...params);
  }
}

const calc = new PriceCalculator();

calc.setStrategy('normal');
console.log(calc.calculate(100)); // 100

calc.setStrategy('vip');
console.log(calc.calculate(100)); // 80

calc.setStrategy('sale');
console.log(calc.calculate(100, 0.6)); // 60

calc.setStrategy('coupon');
console.log(calc.calculate(100, 30)); // 70`,
      },
    ],
  },
  {
    id: "decorator",
    name: "装饰器模式",
    nameEn: "Decorator",
    category: "结构型",
    description:
      "装饰器模式允许向一个对象动态添加新的功能，而不改变其结构。它是继承的替代方案，通过组合而非继承来扩展对象功能。装饰器可以层层嵌套，每一层添加一种新能力，灵活地组合出不同的功能组合。",
    keyPoints: [
      "动态添加功能而不修改原对象",
      "装饰器可层层叠加",
      "比继承更灵活",
    ],
    examples: [
      {
        title: "函数装饰器 - 日志/性能/缓存",
        code: `function withLogging(fn) {
  return function (...args) {
    console.log(\`调用 \${fn.name}，参数:\`, args);
    const result = fn.apply(this, args);
    console.log(\`\${fn.name} 返回:\`, result);
    return result;
  };
}

function withTiming(fn) {
  return function (...args) {
    const start = Date.now();
    const result = fn.apply(this, args);
    console.log(\`\${fn.name} 耗时: \${Date.now() - start}ms\`);
    return result;
  };
}

function withCache(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('命中缓存');
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

const enhanced = withLogging(withTiming(withCache(fibonacci)));
enhanced(10);
enhanced(10); // 命中缓存`,
      },
      {
        title: "类装饰器 - 咖啡订单",
        code: `class Coffee {
  cost() { return 10; }
  description() { return '基础咖啡'; }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 3; }
  description() { return this.coffee.description() + ' + 牛奶'; }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 1; }
  description() { return this.coffee.description() + ' + 糖'; }
}

class WhipDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  cost() { return this.coffee.cost() + 5; }
  description() { return this.coffee.description() + ' + 奶油'; }
}

let order = new Coffee();
order = new MilkDecorator(order);
order = new SugarDecorator(order);
order = new WhipDecorator(order);

console.log(order.description()); // 基础咖啡 + 牛奶 + 糖 + 奶油
console.log(\`总价: ¥\${order.cost()}\`); // 总价: ¥19`,
      },
    ],
  },
  {
    id: "adapter",
    name: "适配器模式",
    nameEn: "Adapter",
    category: "结构型",
    description:
      "适配器模式将一个类的接口转换成客户端期望的另一个接口，使原本接口不兼容的类可以一起工作。它就像现实中的电源适配器，在不修改现有代码的情况下，让新旧系统协同工作。常用于整合第三方库或遗留系统。",
    keyPoints: [
      "转换不兼容的接口",
      "不修改原有代码即可复用",
      "连接新旧系统的桥梁",
    ],
    examples: [
      {
        title: "第三方日志库适配",
        code: `class OldLogger {
  logMessage(msg, level) {
    console.log(\`[\${level.toUpperCase()}] \${msg}\`);
  }
}

class NewLoggerAdapter {
  constructor() {
    this.oldLogger = new OldLogger();
  }

  info(msg) {
    this.oldLogger.logMessage(msg, 'info');
  }

  warn(msg) {
    this.oldLogger.logMessage(msg, 'warn');
  }

  error(msg) {
    this.oldLogger.logMessage(msg, 'error');
  }

  debug(msg) {
    this.oldLogger.logMessage(msg, 'debug');
  }
}

const logger = new NewLoggerAdapter();
logger.info('系统启动');
logger.error('连接失败');
logger.debug('变量值: x=42');`,
      },
      {
        title: "API响应适配器",
        code: `class LegacyUserAPI {
  getUser(id) {
    return {
      user_id: id,
      first_name: '张',
      last_name: '三',
      email_address: 'zhangsan@example.com',
      phone_number: '13800138000',
      create_date: '2024-01-01'
    };
  }
}

class UserAPIAdapter {
  constructor() {
    this.legacyAPI = new LegacyUserAPI();
  }

  getUser(id) {
    const legacy = this.legacyAPI.getUser(id);
    return {
      id: legacy.user_id,
      name: \`\${legacy.first_name}\${legacy.last_name}\`,
      email: legacy.email_address,
      phone: legacy.phone_number,
      createdAt: new Date(legacy.create_date).toISOString()
    };
  }
}

const api = new UserAPIAdapter();
const user = api.getUser(1);
console.log(user);
// { id: 1, name: '张三', email: '...', phone: '...', createdAt: '...' }`,
      },
    ],
  },
  {
    id: "facade",
    name: "外观模式",
    nameEn: "Facade",
    category: "结构型",
    description:
      "外观模式为子系统中的一组接口提供一个统一的高层接口，使子系统更容易使用。它隐藏了系统的复杂性，对外提供简单的调用方式。就像电脑的开机按钮，背后执行了内存检测、系统加载等复杂操作，但用户只需按一个按钮。",
    keyPoints: [
      "简化复杂子系统的使用",
      "提供统一的高层接口",
      "降低客户端与子系统的耦合",
    ],
    examples: [
      {
        title: "多媒体播放器外观",
        code: `class AudioDecoder {
  decode(file) { return \`解码音频: \${file}\`; }
}

class VideoDecoder {
  decode(file) { return \`解码视频: \${file}\`; }
}

class SubtitleParser {
  parse(file) { return \`加载字幕: \${file}\`; }
}

class AudioOutput {
  play(data) { return \`播放音频...\`; }
}

class VideoRenderer {
  render(data) { return \`渲染视频画面...\`; }
}

class MediaPlayerFacade {
  constructor() {
    this.audioDecoder = new AudioDecoder();
    this.videoDecoder = new VideoDecoder();
    this.subtitleParser = new SubtitleParser();
    this.audioOutput = new AudioOutput();
    this.videoRenderer = new VideoRenderer();
  }

  playMovie(movieFile, subtitleFile) {
    const results = [];
    results.push(this.videoDecoder.decode(movieFile));
    results.push(this.audioDecoder.decode(movieFile));
    if (subtitleFile) {
      results.push(this.subtitleParser.parse(subtitleFile));
    }
    results.push(this.videoRenderer.render());
    results.push(this.audioOutput.play());
    return results;
  }
}

const player = new MediaPlayerFacade();
const steps = player.playMovie('movie.mp4', 'movie.srt');
steps.forEach(s => console.log(s));`,
      },
      {
        title: "电商下单外观",
        code: `class Inventory {
  check(itemId) {
    console.log(\`检查库存: \${itemId}\`);
    return true;
  }
  reserve(itemId) {
    console.log(\`锁定库存: \${itemId}\`);
  }
}

class Payment {
  process(amount, method) {
    console.log(\`处理支付: ¥\${amount}, 方式: \${method}\`);
    return { txId: 'TX' + Date.now() };
  }
}

class Shipping {
  schedule(address) {
    console.log(\`安排配送至: \${address}\`);
    return { trackingId: 'SH' + Date.now() };
  }
}

class Notification {
  send(userId, message) {
    console.log(\`通知用户\${userId}: \${message}\`);
  }
}

class OrderFacade {
  constructor() {
    this.inventory = new Inventory();
    this.payment = new Payment();
    this.shipping = new Shipping();
    this.notification = new Notification();
  }

  placeOrder(userId, itemId, amount, payMethod, address) {
    if (!this.inventory.check(itemId)) {
      throw new Error('库存不足');
    }
    this.inventory.reserve(itemId);
    const pay = this.payment.process(amount, payMethod);
    const ship = this.shipping.schedule(address);
    this.notification.send(userId, '下单成功!');
    return { txId: pay.txId, trackingId: ship.trackingId };
  }
}

const order = new OrderFacade();
order.placeOrder('U1', 'ITEM-001', 99, '微信支付', '北京市朝阳区');`,
      },
    ],
  },
  {
    id: "proxy",
    name: "代理模式",
    nameEn: "Proxy",
    category: "结构型",
    description:
      "代理模式为其他对象提供一种代理以控制对这个对象的访问。代理对象在客户端和目标对象之间起到中介作用，可以在不改变目标对象的情况下添加额外的功能，如访问控制、缓存、延迟加载、日志记录等。",
    keyPoints: [
      "控制对目标对象的访问",
      "在访问前后添加额外逻辑",
      "对客户端透明",
    ],
    examples: [
      {
        title: "Proxy实现数据验证",
        code: `const userValidator = {
  set(target, property, value) {
    if (property === 'age') {
      if (typeof value !== 'number') {
        throw new TypeError('年龄必须是数字');
      }
      if (value < 0 || value > 150) {
        throw new RangeError('年龄必须在0-150之间');
      }
    }
    if (property === 'email') {
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
        throw new Error('邮箱格式不正确');
      }
    }
    target[property] = value;
    return true;
  },

  get(target, property) {
    if (property === 'fullInfo') {
      return \`\${target.name} (\${target.age}) - \${target.email}\`;
    }
    return target[property];
  }
};

const user = new Proxy({}, userValidator);
user.name = '李四';
user.age = 25;
user.email = 'lisi@example.com';
console.log(user.fullInfo);

try {
  user.age = 200; // 抛出 RangeError
} catch (e) {
  console.log(e.message);
}`,
      },
      {
        title: "虚拟代理 - 图片懒加载",
        code: `class RealImage {
  constructor(url) {
    this.url = url;
    this.loadImage();
  }

  loadImage() {
    console.log(\`从服务器加载图片: \${this.url}\`);
    this.data = \`[图片数据: \${this.url}]\`;
  }

  display() {
    console.log(\`显示图片: \${this.data}\`);
  }
}

class ImageProxy {
  constructor(url) {
    this.url = url;
    this.realImage = null;
  }

  display() {
    if (!this.realImage) {
      console.log(\`显示占位符...\`);
      this.realImage = new RealImage(this.url);
    }
    this.realImage.display();
  }
}

const gallery = [
  new ImageProxy('photo1.jpg'),
  new ImageProxy('photo2.jpg'),
  new ImageProxy('photo3.jpg')
];

// 只有被显示的图片才会真正加载
console.log('--- 显示第一张 ---');
gallery[0].display();
console.log('--- 再次显示第一张(已缓存) ---');
gallery[0].display();`,
      },
    ],
  },
  {
    id: "command",
    name: "命令模式",
    nameEn: "Command",
    category: "行为型",
    description:
      "命令模式将请求封装成对象，从而可以用不同的请求来参数化客户端，支持请求的排队、记录日志、撤销操作等功能。它将'发出请求的对象'与'执行请求的对象'解耦。常用于实现撤销/重做、宏命令、事务操作等。",
    keyPoints: [
      "将操作封装为命令对象",
      "支持撤销/重做",
      "命令可排队和延迟执行",
    ],
    examples: [
      {
        title: "文本编辑器 - 撤销/重做",
        code: `class TextEditor {
  constructor() {
    this.content = '';
  }
  insert(text, position) {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
  }
  delete(position, length) {
    this.content = this.content.slice(0, position) + this.content.slice(position + length);
  }
  toString() { return this.content; }
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
  constructor() {
    this.history = [];
    this.pointer = -1;
  }
  execute(command) {
    command.execute();
    this.history = this.history.slice(0, this.pointer + 1);
    this.history.push(command);
    this.pointer++;
  }
  undo() {
    if (this.pointer >= 0) {
      this.history[this.pointer].undo();
      this.pointer--;
    }
  }
  redo() {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      this.history[this.pointer].execute();
    }
  }
}

const editor = new TextEditor();
const history = new CommandHistory();

history.execute(new InsertCommand(editor, 'Hello', 0));
history.execute(new InsertCommand(editor, ' World', 5));
console.log(editor.toString()); // 'Hello World'

history.undo();
console.log(editor.toString()); // 'Hello'

history.redo();
console.log(editor.toString()); // 'Hello World'`,
      },
      {
        title: "智能家居遥控器",
        code: `class Light {
  on() { return '灯已打开'; }
  off() { return '灯已关闭'; }
}

class AirConditioner {
  on() { return '空调已打开'; }
  off() { return '空调已关闭'; }
  setTemp(t) { return \`温度设为\${t}°C\`; }
}

class LightOnCommand {
  constructor(light) { this.light = light; }
  execute() { return this.light.on(); }
  undo() { return this.light.off(); }
}

class ACAutoCommand {
  constructor(ac, temp) { this.ac = ac; this.temp = temp; }
  execute() {
    return [this.ac.on(), this.ac.setTemp(this.temp)].join(', ');
  }
  undo() { return this.ac.off(); }
}

class MacroCommand {
  constructor(commands) { this.commands = commands; }
  execute() { return this.commands.map(c => c.execute()); }
  undo() { return this.commands.reverse().map(c => c.undo()); }
}

const light = new Light();
const ac = new AirConditioner();

const homeMode = new MacroCommand([
  new LightOnCommand(light),
  new ACAutoCommand(ac, 24)
]);

console.log('回家模式:', homeMode.execute());
console.log('离家模式:', homeMode.undo());`,
      },
    ],
  },
  {
    id: "iterator",
    name: "迭代器模式",
    nameEn: "Iterator",
    category: "行为型",
    description:
      "迭代器模式提供一种方法顺序访问一个聚合对象中的各个元素，而又不需暴露该对象的内部表示。JavaScript中的 for...of 循环和 Symbol.iterator 就是迭代器模式的原生实现。它让不同数据结构能以统一的方式被遍历。",
    keyPoints: [
      "统一不同数据结构的遍历方式",
      "不暴露集合的内部结构",
      "支持多种遍历策略",
    ],
    examples: [
      {
        title: "自定义范围迭代器",
        code: `class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const { end, step } = this;

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

console.log([...new Range(0, 5)]); // [0, 1, 2, 3, 4, 5]

const [a, b, c] = new Range(10, 30, 10);
console.log(a, b, c); // 10, 20, 30`,
      },
      {
        title: "树结构深度优先迭代器",
        code: `class TreeNode {
  constructor(value, children = []) {
    this.value = value;
    this.children = children;
  }
}

class DepthFirstIterator {
  constructor(root) {
    this.stack = [root];
  }

  [Symbol.iterator]() { return this; }

  next() {
    if (this.stack.length === 0) {
      return { done: true };
    }
    const node = this.stack.pop();
    for (let i = node.children.length - 1; i >= 0; i--) {
      this.stack.push(node.children[i]);
    }
    return { value: node.value, done: false };
  }
}

const tree = new TreeNode('根', [
  new TreeNode('A', [
    new TreeNode('A1'),
    new TreeNode('A2')
  ]),
  new TreeNode('B', [
    new TreeNode('B1')
  ]),
  new TreeNode('C')
]);

for (const value of new DepthFirstIterator(tree)) {
  console.log(value); // 根, A, A1, A2, B, B1, C
}`,
      },
    ],
  },
  {
    id: "state",
    name: "状态模式",
    nameEn: "State",
    category: "行为型",
    description:
      "状态模式允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。它将与特定状态相关的行为封装在独立的状态类中，使状态转换逻辑更清晰。适用于对象行为取决于其状态，且状态数较多的场景。",
    keyPoints: [
      "对象行为随状态改变而改变",
      "将状态逻辑封装在独立类中",
      "状态转换规则清晰明确",
    ],
    examples: [
      {
        title: "交通信号灯状态机",
        code: `class RedLight {
  constructor(context) { this.context = context; }
  display() { return '🔴 红灯 - 禁止通行'; }
  next() { this.context.setState(new GreenLight(this.context)); }
  duration() { return 30; }
}

class GreenLight {
  constructor(context) { this.context = context; }
  display() { return '🟢 绿灯 - 允许通行'; }
  next() { this.context.setState(new YellowLight(this.context)); }
  duration() { return 25; }
}

class YellowLight {
  constructor(context) { this.context = context; }
  display() { return '🟡 黄灯 - 准备停车'; }
  next() { this.context.setState(new RedLight(this.context)); }
  duration() { return 5; }
}

class TrafficLight {
  constructor() {
    this.state = new RedLight(this);
  }
  setState(state) { this.state = state; }
  display() { return this.state.display(); }
  change() { this.state.next(); }
  getDuration() { return this.state.duration(); }
}

const light = new TrafficLight();
console.log(light.display()); // 红灯
light.change();
console.log(light.display()); // 绿灯
light.change();
console.log(light.display()); // 黄灯
light.change();
console.log(light.display()); // 红灯`,
      },
      {
        title: "订单状态流转",
        code: `class Order {
  constructor() {
    this.state = new PendingState(this);
    this.log = [];
  }
  setState(state) {
    this.log.push(this.state.name);
    this.state = state;
  }
  pay() { return this.state.pay(); }
  ship() { return this.state.ship(); }
  deliver() { return this.state.deliver(); }
  cancel() { return this.state.cancel(); }
  getStatus() { return this.state.name; }
}

class PendingState {
  constructor(order) { this.order = order; this.name = '待付款'; }
  pay() { this.order.setState(new PaidState(this.order)); return '支付成功'; }
  ship() { return '错误: 请先完成支付'; }
  deliver() { return '错误: 订单尚未发货'; }
  cancel() { this.order.setState(new CancelledState(this.order)); return '订单已取消'; }
}

class PaidState {
  constructor(order) { this.order = order; this.name = '已付款'; }
  pay() { return '错误: 已经付过款了'; }
  ship() { this.order.setState(new ShippedState(this.order)); return '已发货'; }
  deliver() { return '错误: 尚未发货'; }
  cancel() { this.order.setState(new CancelledState(this.order)); return '已取消并退款'; }
}

class ShippedState {
  constructor(order) { this.order = order; this.name = '已发货'; }
  pay() { return '错误: 已付款'; }
  ship() { return '错误: 已发货'; }
  deliver() { this.order.setState(new DeliveredState(this.order)); return '已签收'; }
  cancel() { return '错误: 已发货不可取消'; }
}

class DeliveredState {
  constructor(order) { this.order = order; this.name = '已签收'; }
  pay() { return '订单已完成'; }
  ship() { return '订单已完成'; }
  deliver() { return '已签收'; }
  cancel() { return '错误: 已签收不可取消'; }
}

class CancelledState {
  constructor(order) { this.order = order; this.name = '已取消'; }
  pay() { return '订单已取消'; }
  ship() { return '订单已取消'; }
  deliver() { return '订单已取消'; }
  cancel() { return '已经取消了'; }
}

const order = new Order();
console.log(order.pay());     // 支付成功
console.log(order.ship());    // 已发货
console.log(order.cancel());  // 错误: 已发货不可取消
console.log(order.deliver()); // 已签收`,
      },
    ],
  },
  {
    id: "mediator",
    name: "中介者模式",
    nameEn: "Mediator",
    category: "行为型",
    description:
      "中介者模式用一个中介对象来封装一系列的对象交互，使各对象不需要显式地相互引用，从而使其耦合松散。它将多对多的交互简化为一对多的交互，所有组件只与中介者通信。常见于聊天室、表单联动、飞机调度塔台等场景。",
    keyPoints: [
      "将多对多交互简化为一对多",
      "组件间不直接通信",
      "中介者统一协调各组件",
    ],
    examples: [
      {
        title: "聊天室中介者",
        code: `class ChatRoom {
  constructor() {
    this.users = {};
  }

  register(user) {
    this.users[user.name] = user;
    user.chatRoom = this;
  }

  send(message, from, to) {
    if (to) {
      if (this.users[to]) {
        this.users[to].receive(message, from);
      }
    } else {
      Object.values(this.users).forEach(user => {
        if (user.name !== from) {
          user.receive(message, from);
        }
      });
    }
  }
}

class User {
  constructor(name) {
    this.name = name;
    this.chatRoom = null;
    this.messages = [];
  }

  send(message, to) {
    console.log(\`\${this.name} 发送: \${message}\`);
    this.chatRoom.send(message, this.name, to);
  }

  receive(message, from) {
    const msg = \`\${from} -> \${this.name}: \${message}\`;
    this.messages.push(msg);
    console.log(msg);
  }
}

const room = new ChatRoom();
const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');

room.register(alice);
room.register(bob);
room.register(charlie);

alice.send('大家好!');        // 广播
bob.send('嗨Alice!', 'Alice'); // 私聊`,
      },
      {
        title: "表单联动中介者",
        code: `class FormMediator {
  constructor() {
    this.components = {};
  }

  register(name, component) {
    this.components[name] = component;
    component.mediator = this;
  }

  notify(sender, event, data) {
    if (sender === 'country' && event === 'change') {
      this.components.province.updateOptions(data);
      this.components.city.reset();
    }
    if (sender === 'province' && event === 'change') {
      this.components.city.updateOptions(data);
    }
    if (sender === 'orderType' && event === 'change') {
      this.components.price.setVisible(data === 'paid');
      this.components.discount.setVisible(data === 'paid');
    }
  }
}

class FormSelect {
  constructor(name) {
    this.name = name;
    this.value = '';
    this.options = [];
    this.visible = true;
    this.mediator = null;
  }

  change(value) {
    this.value = value;
    console.log(\`\${this.name} 选择了: \${value}\`);
    this.mediator.notify(this.name, 'change', value);
  }

  updateOptions(parentValue) {
    console.log(\`\${this.name} 根据 "\${parentValue}" 更新了选项\`);
  }

  reset() { this.value = ''; console.log(\`\${this.name} 已重置\`); }
  setVisible(v) { this.visible = v; console.log(\`\${this.name} 可见性: \${v}\`); }
}

const mediator = new FormMediator();
const country = new FormSelect('country');
const province = new FormSelect('province');
const city = new FormSelect('city');

mediator.register('country', country);
mediator.register('province', province);
mediator.register('city', city);

country.change('中国');`,
      },
    ],
  },
];
