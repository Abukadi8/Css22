import { getUniqueObjectsFromArray, parseStringToObject } from "./utils.js";
// add event on button
document
  .getElementById("extractButton")
  .addEventListener("click", extractClasses);

// get or set data => Html file
function extractClasses() {
  const inputTextArea = document.getElementById("inputTextArea").value;
  extractClassesFromStyleTags(inputTextArea);
}

// main function
const extractClassesFromStyleTags = (input) => {
  const fristTextArea = document.getElementById("fristTextArea");
  const secondTextArea = document.getElementById("secondTextArea");
  const styleTags = input.match(/((\*|.|#)[\w\d\s\-_:.,()]+{[^}]*})/g);

  const extractedClasses = [];
  if (styleTags) {
    styleTags.forEach((styleTag) => {
      const classes = styleTag.match(/(.|#)*?{[^}]*}/gi);
      if (classes) {
        classes.forEach((cssClass) => {
          extractedClasses.push(cssClass);
        });
      }
    });
  }

  const arrayOfObjects = extractedClasses.map((item) =>
    parseStringToObject(item)
  );
  const filterArrayOfObjects = arrayOfObjects.filter(
    (obj) =>
      !obj.className.includes("@") &&
      !obj.className.includes("%") &&
      !obj.className.includes("*") &&
      !parseInt(obj.className)
  );
  const duplicates = findDuplicateObjects(filterArrayOfObjects);
  const identicalValues = getUniqueObjectsFromArray(duplicates.identicalValues);
  const identicalClassName = getUniqueObjectsFromArray(
    duplicates.identicalClassName
  );
  let matchClassAndProprty = identicalValues.map((value) => value.className);
  let uniqueClassAndProprty = [...new Set(matchClassAndProprty)];
  //طباعه الاسماء والخصائه المتشابها
  fristTextArea.innerHTML = uniqueClassAndProprty.join(" ");
  console.log(identicalClassName);
  //طباعه الاسماءالمتشابها والخصائص الغير متشابها
  const classNameByIdenticalClassName = identicalClassName.map(
    (value) => value.className
  );

  secondTextArea.innerHTML = classNameByIdenticalClassName.join(" ");
  differentClassNameAndValues(
    filterArrayOfObjects,
    uniqueClassAndProprty,
    classNameByIdenticalClassName
  );
  return filterArrayOfObjects;
};

// function return final values after comparison
const findDuplicateObjects = (arr) => {
  let identicalValues = [];
  let identicalClassName = [];
  let differentObjects = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (compareObjects(arr[i], arr[j])) {
        identicalValues.push(arr[i]);
        identicalValues.push(arr[j]);
      } else if (compareClassNameAndLength(arr[i], arr[j])) {
        identicalClassName.push(arr[i]);
        identicalClassName.push(arr[j]);
      } else {
        differentObjects.push(arr[i]);
        differentObjects.push(arr[j]);
      }
    }
  }

  return {
    identicalValues,
    identicalClassName,
    differentObjects,
  };
};

// ----------- compare cases functions -----------------
const compareObjects = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

const compareClassNameAndLength = (obj1, obj2) => {
  if (obj1.className !== obj2.className) {
    return false;
  }
  return true;
};
// الكلاسات المختلفه في الاسم والمتشابها في الخصائص
const differentClassNameAndValues = (arr, arrclass, uniqueclass) => {
  const thereTextArea = document.getElementById("thereTextArea");
  function compareObjects(obj1, obj2) {
    let keys1 = Object.keys(obj1).filter((key) => key !== "className");
    let keys2 = Object.keys(obj2).filter((key) => key !== "className");

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  let similarObjects = arr.reduce((result, item, index) => {
    let duplicateIndex = result.findIndex((obj) => compareObjects(obj, item));
    if (duplicateIndex !== -1) {
      result[duplicateIndex].className += ` ${item.className}`;
    } else {
      result.push({ ...item });
    }
    return result;
  }, []);
  let classname = similarObjects.map((obj) => obj.className);
  let convertedArr = classname.map((item) => item.split(" "));
  let fillter = convertedArr.filter((item) => item.length >= 2);
  let resultText = fillter.toString();
  let toArry = resultText.split(",");
  const filteredArray = toArry.filter((element) => !arrclass.includes(element));
  const notRepated = [...new Set(filteredArray)];
  thereTextArea.innerHTML = notRepated.join(" ");
  let allClassName = arr.map((name) => name.className);
  restClass(allClassName, arrclass, filteredArray, uniqueclass);
};
//باقي الكلاسات
const restClass = (allclass, arrclassAndProprity, proprity, uniqueclass) => {
  const foreTextArea = document.getElementById("foreTextArea");
  let arr = [...arrclassAndProprity, ...proprity, ...uniqueclass];
  const filteredArray = allclass.filter((element) => !arr.includes(element));
  let notRepated = [...new Set(filteredArray)];
  let restClass = notRepated.filter((ele) => !ele.includes(","));
  foreTextArea.innerHTML = restClass.join(" ");
};

//change language
//تغير اللغه من عربي الي انجلش والعكس
const wrapArabic = document.getElementById("ar");
const wrapEnglish = document.getElementById("en");
const myBtnChangeEnglish = document.getElementById("changeEnglish");
const myBtnChangeArabic = document.getElementById("changeArabic");

myBtnChangeEnglish.addEventListener("click", () => {
  wrapArabic.style.display = "none";
  wrapEnglish.style.display = "block";
});

myBtnChangeArabic.addEventListener("click", () => {
  wrapArabic.style.display = "block";
  wrapEnglish.style.display = "none";
});
