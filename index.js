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
      return item
    })

    let dataWrite = JSON.stringify(items);
    await fs.promises.writeFile('data-clean.json', dataWrite);
}
const formatterJsonToDynamoDb = async () =>{
  const dataLoaded = await fs.promises.readFile('data-clean.json', 'utf8')
  const data = JSON.parse(dataLoaded)
  const items = data.map((element) =>{
    if(Array.isArray(element.PROYECTOS)){

      element.PROYECTOS = element.PROYECTOS.map((proyecto, index) => ({[index]:proyecto}))

    }else{
      element.PROYECTOS = [];
    }
    const itemDynamo = attr.wrap(element)
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
  await fs.promises.writeFile('data-dynamo.json', dataWrite);
}
const runScript = async () =>{
  await formatterJson()
  await formatterJsonToDynamoDb()
}

runScript();
