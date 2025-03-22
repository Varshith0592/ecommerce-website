import ProductImageUpload from "@/components/admin-view/image-upload"
import AdminProductTile from "@/components/admin-view/product-tile"
import CommonForm from "@/components/common/form"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { addProductFormElements } from "@/config"
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice"
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: 0,
}

function AdminProducts() {

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [imageLoadingState, setImageLoadingState] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null)
  const dispatch = useDispatch()
  const { productList } = useSelector(state => state.adminProducts)

  function onSubmit(event) {
    event.preventDefault()

    currentEditedId!==null?
    dispatch(editProduct({
      id: currentEditedId,
      formData: formData
    })).then((data)=>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts()),
        setOpenCreateProductsDialog(false),
        setFormData(initialFormData),
        setCurrentEditedId(null)
      }
    }):
    dispatch(addNewProduct({
      ...formData,
      image: uploadedImageUrl
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts())
        setImageFile(null)
        setFormData(initialFormData)
        toast('Product Added Successfully', {
          style: {
            backgroundColor: '#4CAF50',
            color: 'white',
            fontSize: '16px',
            borderRadius: '8px',
            padding: '12px 24px',
          },
          duration: 5000, // Show for 5 seconds
        })
        setOpenCreateProductsDialog(false)
      }
    })
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  function isFormValid(){
    return Object.keys(formData)
    .map(key=> formData[key]!=='')
    .every(item=>item)
  }

  function handleDelete(getCurrentProductId){
    dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts())
        toast('Product Deleted Successfully', {
          style: {
            backgroundColor: '#FF0000',
            color: 'white',
            fontSize: '16px',
            borderRadius: '8px',
            padding: '12px 24px',
          },
          duration: 5000, // Show for 5 seconds
        })
      }
    })
  }

  return <Fragment>
    <div className="mb-5 flex justify-end w-full">
      <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {

        productList && productList.length > 0 ?
          productList.map(productItem => 
          <AdminProductTile
            setFormData={setFormData}
            setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            setCurrentEditedId={setCurrentEditedId}
            product={productItem} 
            handleDelete={handleDelete}
          />)
          : null
      }
    </div>
    <Sheet
      open={openCreateProductsDialog}
      onOpenChange={() => {
        setOpenCreateProductsDialog(false)
        setCurrentEditedId(null)
        setFormData(initialFormData)
      }}
    >
      <SheetContent side="right" className="overflow-auto">
        <SheetHeader>
          <SheetTitle>
            {
              currentEditedId ? 'Edit Product' : 'Add New Product'
            }
          </SheetTitle>
        </SheetHeader>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isEditMode={currentEditedId !== null}
        />
        <div className="py-6 px-6">
          <CommonForm
            formControls={addProductFormElements}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId?'Edit Product' : 'Add Product'}
            onSubmit={onSubmit}
            isBtnDisabled={!isFormValid()}
          />
        </div>
      </SheetContent>
    </Sheet>
  </Fragment>
}

export default AdminProducts