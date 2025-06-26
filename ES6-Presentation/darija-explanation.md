# شرح ES6 بالدارجة المغربية
## للعرض في القسم

### 1. Let و Const (المتغيرات)

**بالدارجة:**
فهاد الجزء كنشوفو كيفاش تعلنو على المتغيرات بطريقة جديدة. قبل ES6 كنا كنستعملو غير `var` وكانت عندها مشاكل بزاف.

- `var`: كتقدر تعاود تعلن عليها وكتقدر تبدل القيمة ديالها، وكتطلع فوق (hoisting).
- `let`: متقدرش تعاود تعلن عليها ولكن تقدر تبدل القيمة ديالها، وكتبقى فالبلوك لي علنتي عليها فيه.
- `const`: متقدرش تعاود تعلن عليها ومتقدرش تبدل القيمة ديالها، وكتبقى فالبلوك لي علنتي عليها فيه.

**مثال:**
```javascript
// الطريقة القديمة
var name = "John";
var name = "Jane"; // هادي مقبولة

// الطريقة الجديدة
let age = 25;
age = 26; // هادي مقبولة
// let age = 30; // هادي غادي تعطي error

const PI = 3.14;
// PI = 3.15; // هادي غادي تعطي error
```

**فوقاش نستعملو كل وحدة:**
- استعمل `const` إلا كنتي متأكد أن القيمة ماغاديش تتبدل
- استعمل `let` إلا كنتي بغيتي تبدل القيمة من بعد
- تجنب استعمال `var` فالجافاسكريبت الحديثة

### 2. Arrow Functions (الدوال السهمية)

**بالدارجة:**
الدوال السهمية هي طريقة جديدة وقصيرة باش تكتب الدوال. كتسهل عليك الكتابة وكتحل مشاكل ديال `this`.

**مثال:**
```javascript
// الطريقة القديمة
function add(a, b) {
  return a + b;
}

// الطريقة الجديدة
const add = (a, b) => a + b;

// إلا كان عندك أكثر من سطر
const multiply = (a, b) => {
    return a * b;
}

console.log(multiply(2, 3));
```

**الفرق الكبير** هو فمعالجة `this`. فالدوال العادية، `this` كيتبدل حسب كيفاش كتستدعي الدالة. فالدوال السهمية، `this` كيبقى هو نفسو من المكان لي تكتبات فيه الدالة.

### 3. Template Literals (قوالب النصوص)

**بالدارجة:**
هادي طريقة جديدة باش تكتب النصوص، كتسهل عليك تجمع النصوص مع المتغيرات وتكتب نصوص على عدة أسطر.

**مثال:**
```javascript
// الطريقة القديمة
var name = "John";
var greeting = "Salam, " + name + "!";

// الطريقة الجديدة
const name = "John";
const greeting = `Salam, ${name}!`;  

// نص على عدة أسطر
const multiline = `
  Hada star jdid
  3la 3adad dyial stor
  bla ma nsta3mal \n
`;
```

**مميزات:**
- تقدر تدير متغيرات وسط النص بسهولة: `${variable}`
- تقدر تكتب نص على عدة أسطر بلا إشارات خاصة
- تقدر تدير عمليات حسابية داخل `${}`

### 4. Default Parameters (المعاملات الافتراضية)

**بالدارجة:**
هادي كتخليك تحط قيم افتراضية للمعاملات ديال الدالة. إلا ماعطيتيش قيمة للمعامل، غادي ياخد القيمة الافتراضية.

**مثال:**
```javascript
// الطريقة القديمة
function greet(name) {
  name = name || "Guest";
  return "Salam, " + name;
}

// الطريقة الجديدة
function greet(name = "Guest") {
  return `Salam, ${name}`;
}

// مثال آخر
function createUser(username = "anonymous", age = 0, isAdmin = false) {
  return { username, age, isAdmin };
}
```

**فوائد:**
- كود أنظف ومفهوم أكثر
- متحتاجش تدير الفحص داخل الدالة
- تقدر تستعمل التعبيرات كقيم افتراضية: `date = new Date()`

### 5. Destructuring (التفكيك)

**بالدارجة:**
التفكيك كيسمح لك تاخد قيم من الأوبجيكت أو الأراي بطريقة سهلة ومباشرة.

**مثال للأوبجيكت:**
```javascript
// الطريقة القديمة
var person = { name: "John", age: 30 };
var name = person.name;
var age = person.age;

// الطريقة الجديدة
const person = { name: "John", age: 30 };
const { name, age } = person;

// تقدر تغير الأسماء
const { name: fullName, age: years } = person;
```

**مثال للأراي:**
```javascript
// الطريقة القديمة
var colors = ["red", "green", "blue"];
var first = colors[0];
var second = colors[1];

// الطريقة الجديدة
const colors = ["red", "green", "blue"];
const [first, second] = colors;
```

### 6. Spread و Rest Operators (عوامل النشر والتجميع)

**بالدارجة:**
هادو جوج عوامل كيستعملو نفس الرمز `...` ولكن بطرق مختلفة:
- **Spread**: كينشر العناصر ديال أراي أو أوبجيكت
- **Rest**: كيجمع عدة عناصر في أراي واحد

**مثال Spread:**
```javascript
// دمج الأرايات
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const combined = [...array1, ...array2]; // [1, 2, 3, 4, 5, 6]

// نسخ أوبجيكت مع تغيير
const person = { name: "John", age: 30 };
const updated = { ...person, age: 31 }; // { name: "John", age: 31 }
```

**مثال Rest:**
```javascript
// تجميع المعاملات
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
sum(1, 2, 3, 4); // 10

// تجميع باقي العناصر
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log(rest); // [2, 3, 4, 5]
```

### 7. Classes (الفئات)

**بالدارجة:**
الكلاسات هي طريقة جديدة وسهلة باش تكتب البرمجة الشيئية في جافاسكريبت.

**مثال:**
```javascript
// الطريقة القديمة
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() {
  return "Smiti " + this.name;
};

// الطريقة الجديدة
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Smiti ${this.name}`;
  }
  
  static create(name, age) {
    return new Person(name, age);
  }
}

// الوراثة
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
}
```

**مميزات:**
- كتابة أوضح وأسهل للفهم
- دعم للوراثة بشكل مباشر مع `extends`
- دوال ستاتيكية مع `static`
- استدعاء الكلاس الأب مع `super`

### 8. Promises (الوعود)

**بالدارجة:**
الوعود هي طريقة جديدة باش تتعامل مع العمليات غير المتزامنة (asynchronous) بشكل أفضل من callbacks.

**مثال:**
```javascript
// الطريقة القديمة (callback hell)
fetchData(function(data) {
  processData(data, function(processedData) {
    saveData(processedData, function(result) {
      console.log(result);
    });
  });
});

// الطريقة الجديدة (promises)
fetchData()
  .then(data => processData(data))
  .then(processedData => saveData(processedData))
  .then(result => console.log(result))
  .catch(error => console.error(error));

// الطريقة الأحدث (async/await)
async function handleData() {
  try {
    const data = await fetchData();
    const processedData = await processData(data);
    const result = await saveData(processedData);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

**مميزات:**
- كود أكثر وضوحا وأسهل للقراءة
- تعامل أفضل مع الأخطاء
- تسلسل العمليات بشكل أوضح
- مع `async/await` كتقدر تكتب كود غير متزامن بشكل يبدو متزامن

### 9. Modules (الوحدات)

**بالدارجة:**
الموديولات كتخليك تقسم الكود ديالك لأجزاء منفصلة وقابلة لإعادة الاستخدام.

**مثال:**
```javascript
// في ملف math.js
export function add(a, b) {
  return a + b;
}

export const PI = 3.14;

export default class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// في ملف آخر
import { add, PI } from './math.js';
import Calculator from './math.js';
import * as math from './math.js';

console.log(add(2, 3)); // 5
console.log(PI); // 3.14
const calc = new Calculator();
console.log(calc.multiply(2, 3)); // 6
```

**مميزات:**
- تنظيم أفضل للكود
- تجنب تلوث المجال العام (global scope)
- استيراد فقط ما تحتاجه
- دعم مباشر في المتصفحات الحديثة

### 10. Map و Set (خرائط ومجموعات)

**بالدارجة:**
هادو بنيات بيانات جديدة:
- **Map**: مثل أوبجيكت ولكن المفاتيح يمكن تكون أي نوع
- **Set**: مجموعة من القيم الفريدة (بلا تكرار)

**مثال Map:**
```javascript
// الطريقة القديمة
var userRoles = {};
userRoles["john"] = "admin";

// الطريقة الجديدة
const userRoles = new Map();
userRoles.set("john", "admin");
userRoles.set({id: 1}, "special"); // يمكن استخدام أوبجيكت كمفتاح

console.log(userRoles.get("john")); // "admin"
console.log(userRoles.has("john")); // true
console.log(userRoles.size); // 2
```

**مثال Set:**
```javascript
// الطريقة القديمة
function uniqueArray(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    if (result.indexOf(array[i]) === -1) {
      result.push(array[i]);
    }
  }
  return result;
}

// الطريقة الجديدة
const numbers = [1, 2, 3, 3, 4, 4, 5];
const uniqueNumbers = new Set(numbers);
console.log([...uniqueNumbers]); // [1, 2, 3, 4, 5]
```

**فوائد:**
- **Map**: مفاتيح من أي نوع، حجم سهل، أداء أفضل
- **Set**: قيم فريدة بشكل تلقائي، بحث سريع
