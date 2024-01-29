export const deepClone = (obj) => {
  const pair = [];
  for (let key in obj) {
    if (
      obj[key] === null ||
      obj[key] === undefined ||
      typeof obj[key] !== "object"
    ) {
      pair.push({ key, value: obj[key] });
    } else {
      pair.push({ key, value: deepClone(obj[key]) });
    }
    // have not handle function type
  }

  const newObj = obj?.length === undefined && typeof obj === "object" ? {} : [];
  for (let item of pair) {
    newObj[item.key] = item.value;
  }

  return newObj;
};

let childrenX = 0;
let space = 200;
export const indexTree = (root, level = 0, siblingLevel = 0) => {
  root.level = level + 1;
  root.siblingLevel = siblingLevel + 1;
  // root.x = (level + siblingLevel) * 350;
  root.y = level * 100;
  if (root.children?.length > 0) {
    for (let i = 0; i < root.children.length; i++) {
      indexTree(root.children[i], root.level, i);
    }
    root.x =
      root.children.reduce((acc, child) => acc + child.x, 0) /
      root.children.length;
  } else {
    root.x = childrenX + space;
    childrenX += space;
  }
};

export function convertCamelToTitleCase(camelCaseString) {
  // Add a space before all uppercase letters (except the first one)
  const titleCaseString = camelCaseString.replace(/([A-Z])/g, ' $1');
  
  // Capitalize the first letter and trim any leading whitespace
  return titleCaseString.charAt(0).toUpperCase() + titleCaseString.slice(1).trim();
}
