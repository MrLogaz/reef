import mongoose from 'mongoose'

const ProductsGifterySchema = mongoose.Schema({
  id: Number,
  title: String,
  brief: String,
  supplier_id: Number,
  categories: [Number],
  faces: [Number],
  face_step: String,
  digital_acceptance: String,
  face_min: Number,
  face_max: Number,
  disclaimer: String,
  image_url: String
}, {collection : 'ProductsGiftery'})

let ProductsGifteryModel = mongoose.model('ProductsGiftery', ProductsGifterySchema)

ProductsGifteryModel.saveAarray = docArray => {
  let total = docArray.length
  let result = []
  
  return new Promise((resolve, reject) => {
    const saveAll = async () => {
      let doc = new ProductsGifteryModel(docArray.pop())
      doc.save(function(err, saved){
        if (err) reject(err)
        result.push(saved[0])
        if (--total) saveAll()
        else return resolve('Saved ' + result.length + ' products')
      })
    }
    saveAll()
  })
}

export default ProductsGifteryModel
