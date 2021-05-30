const fs = require('fs')
const attr = require('dynamodb-data-types').AttributeValue;
const formatterJson = async() => {
  const dataString = await fs.promises.readFile('co_inspira_co-P8.json', 'utf8')
  const data = JSON.parse(dataString)
  console.log(data.length)
    const items = data.map((item) =>{
      const newKey = 'percent';
      const keyOldEmpty = '';
      const keyId = 'id';
      const oldKey = '%';
      delete Object.assign(item, {[newKey]: item[oldKey] })[oldKey];
      delete Object.assign(item, {[keyId]: item[keyOldEmpty] })[keyOldEmpty];
      return item
    })

    let dataWrite = JSON.stringify(items);
    await fs.promises.writeFile('data-clean.json', dataWrite);
}
const splitJson = async(input_file, number_items) => {
  const dataString = await fs.promises.readFile(input_file, 'utf-8');
  const data = JSON.parse(dataString)
  number_files = data.length/number_items
  var j = 0
  const  array = [0, 25, 50, 75, 100, 125, 150, 175]
  for await (let num of array) {
    console.log(num)
    data_split = data.slice(num,  num + number_items)
    console.log(data_split.length)
    fs.promises.writeFile('data-split-clean'+j+'.json', data_split)
    j = j+1
    console.log(j)
  }
}
function splitJson2 (input_file, number_items) {
  const dataString = fs.readFile(input_file, 'utf-8');
  const data = JSON.parse(dataString)
  number_files = data.length/number_items
  var j = 0
  const  array = [0, 25, 50, 75, 100, 125, 150, 175]
  for (let num = 0; i<7; i= i + number_items) {
    console.log(num)
    data_split = data.slice(num,  num + number_items)
    console.log(data_split.length)
    fs.writeFile('data-split-clean'+j+'.json', data_split)
    j = j+1
  }
}
const formatterJsonToDynamoDb = async (name_file, output_file) =>{
  const dataLoaded = await fs.promises.readFile(name_file, 'utf8')
  const data = JSON.parse(dataLoaded)
  const items = data.map((element) =>{
    if(Array.isArray(element.PROYECTOS)){
      element.PROYECTOS = element.PROYECTOS.map((proyecto, index) => ({[index]:proyecto}))
    }else{
      element.PROYECTOS = [];
    }
    const itemDynamo = "S"
    return { PutRequest:
          {
            Item: itemDynamo
          }
    }
  })
  console.log(items.length)
  const newData={
    coInspira: items
  }
  let dataWrite = JSON.stringify(newData);
  await fs.promises.writeFile(output_file, dataWrite);
}
const runScript = async () =>{
  const i = 4
  input_file = 'data-split-clean'+i+'.json'
  output_file = 'data-split-dynamo'+i+'.json'
  await formatterJsonToDynamoDb(input_file, output_file)
}
runScript();
