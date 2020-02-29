import mongoose from 'mongoose'

const CategoriesGifterySchema = mongoose.Schema({
  id: Number,
  code: String,
  title: String,
  title_en: String,
  type: String,
  active: Number,
  seo_h1: String,
  seo_text: String,
  sort: Number,
  products_count: Number,
  elements: Number
}, {collection : 'CategoriesGiftery'})

let CategoriesGifteryModel = mongoose.model('CategoriesGiftery', CategoriesGifterySchema)

CategoriesGifteryModel.saveAarray = docArray => {
  let total = docArray.length
  let result = []
  
  return new Promise((resolve, reject) => {
    const saveAll = async () => {
      let doc = new CategoriesGifteryModel(docArray.pop())
      doc.save(function(err, saved){
        if (err) reject(err)
        result.push(saved[0])
        if (--total) saveAll()
        else return resolve('Saved ' + result.length + ' categories')
      })
    }
    saveAll()
  })
}

export default CategoriesGifteryModel
