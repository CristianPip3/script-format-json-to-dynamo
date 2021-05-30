const fs = require('fs')
const attr = require('dynamodb-data-types').AttributeValue;

const formatterJson = async() => {
  const dataString = await fs.promises.readFile('co_inspira_co-P8.json', 'utf8' )
  const data = JSON.parse(dataString)
  console.log(data.length)
  const items = data.map((item) =>{
    const newKey = 'percent';
    const keyOldEmpty = '';
    const keyId = 'id';
    const oldKey = '%';
    delete Object.assign(item, {[newKey]: item[oldKey] })[oldKey];
    delete Object.assign(item, {[keyId]: item[keyOldEmpty] })[keyOldEmpty];
    return cleanData(item)
  })
  await formatterJsonToDynamoDb(items)
}
const cleanData = (item) => {
  const stringEmpty = ''
  for (const property in item) {
    const valueProperty = item[property];
    if(isObject(item)){
      cleanData(valueProperty)
    }
    if(valueProperty === stringEmpty){
      item[property] = 'empty'
    }
  }
  return item
}
const isObject = (value) => {
  return typeof value === "object" && value !== null;
}
const formatterJsonToDynamoDb = async (data) =>{

  const items = data.map((element) => {

    if(Array.isArray(element.PROYECTOS)){

      element.PROYECTOS = element.PROYECTOS.map((project, index) => ({[index]:project}))

    }else {
      element.PROYECTOS = [];
    }
    const itemDynamo = attr.wrap(element)
    return { PutRequest: { Item: itemDynamo } }
  })
  const allData = batchItemsDynamo(items);
  let count = 0
  for await (let allDatum of allData) {
    const newData = {
      coInspira: allDatum
    }
    const dataWrite = JSON.stringify(newData);
    await fs.promises.writeFile(`data-clean-${count}.json`, dataWrite);
    count++
  }

}
const batchItemsDynamo = (items) =>{
  const lengthData = items.length
  let itemsRest = []
  let dataItems = []
  const valueDiv = 9;
  const parts = Math.trunc(lengthData/valueDiv)
  const rest = items.length % valueDiv;
  if(rest!==0){
    const indexCopy = lengthData - rest;
    itemsRest = items.slice(indexCopy);
    dataItems = [itemsRest];
    items.splice(indexCopy, rest)
  }
  return [...dataItems,...chunkArray(items,parts)]

}
const chunkArray = (array, parts) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}
const runScript = async () =>{
  await formatterJson()
}
runScript();
