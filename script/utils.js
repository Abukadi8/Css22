// convert array of string to array of ojects
//تحويل الاكود الي داخله اي اوبجكت
const parseStringToObject = (inputString) => {
  const obj = {};
  const className = inputString.split("{")[0].replaceAll(" ", "");
  const propertiesStr = inputString
    .split("{")[1]
    .replace("}", "")
    .replaceAll("!important", "")
    .split(";");
  const properties = propertiesStr.map((prop) => {
    const [key, value] = prop.split(":").map((str) => str.trim());

    if (key.startsWith("*")) {
      let filterMore = key
        .split("")
        .filter((text) => text != "*" && text != "/" && text != "\n");
      obj[filterMore.join("")] = value;
    } else {
      obj[key.replace("*/", "")] = value;
    }
  });
  obj.className = className;

  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
    if (key.includes("/*")) {
      delete obj[key];
    }
  });

  return obj;
};

// function to remove duplicate values in arrays
const getUniqueObjectsFromArray = (arr) => {
  const uniqueObjectsSet = new Set();

  for (const obj of arr) {
    // Convert each object to a JSON string to check for uniqueness
    const objString = JSON.stringify(obj);
    uniqueObjectsSet.add(objString);
  }

  // Convert the Set of unique object strings back to an array of objects
  const uniqueObjectsArray = Array.from(uniqueObjectsSet, JSON.parse);

  return uniqueObjectsArray;
};

export { getUniqueObjectsFromArray, parseStringToObject };
