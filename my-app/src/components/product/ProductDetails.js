import { React, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import NumericInput from 'react-numeric-input';
import '../css/detailsProduct.css';
import useCallGetAPI from '../../customHook/CallGetApi';
import moment from 'moment'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
    getMetadata,
} from "firebase/storage";
import { storage } from "../../Firebase";
import { async } from "@firebase/util";
const ProductDetails = (props) => {
    // const [modal, setModal] = useState(false);
    // const toggle = () => setModal(!modal);
    const navigate = useNavigate()
    const size = [37, 38, 39, 40, 41, 42, 43, 44, 45];
    const { isDetailsModal, toggleModal, updateData, handleUpdateImages, handleImages, imageUrls, setImageUrls } = props;
    const [isSizeModal, setIsSizeModal] = useState(false);
    const [isImageModal, setisImageModal] = useState(false);
    const [product, setProduct] = useState(props.product);
    const imagesListRef = ref(storage, "images/");
    // const [imageUrls, setImageUrls] = useState([]);
    const [sizePro, setSizePro] = useState({});
    const [image, setImage] = useState({});
    const [media, setMedia] = useState({});
    const [imageURL, setImageURL] = useState();
    const [sizeSelect, setSizeSelect] = useState();
    const [imageUpload, setImageUpload] = useState();
    const [sizeProQuantity, setSizeProQuantity] = useState({});
    const [sizes, setSizes] = useState([
        {
            title: 36,
            status: false
        },
        {
            title: 37,
            status: false
        },
        {
            title: 38,
            status: false
        },
        {
            title: 39,
            status: false
        },
        {
            title: 40,
            status: false
        },
        {
            title: 41,
            status: false
        },
        {
            title: 42,
            status: false
        },
        {
            title: 43,
            status: false
        },
        {
            title: 44,
            status: false
        },
        {
            title: 45,
            status: false
        },
        {
            title: 46,
            status: false
        }
    ])

    useEffect(() => {
        setProduct(props.product)
        // setImageUrls([])
        // listAll(imagesListRef).then((response) => {
        //     response.items.forEach((item) => {
        //         let nameImg = item.name;
        //         getDownloadURL(item).then((url) => {
        //             setImageUrls((prev) => [...prev, { nameImg, url }]);
        //         });
        //     });
        // });
        props.product.sizes?.map(item => {
            let copydata = sizes;
            let getIndex = copydata.findIndex((p) => { return p.title == item.size });
            let size = { id: item.id, title: item.size, quantity: item.quantity, status: true }
            copydata.fill(size, getIndex, getIndex + 1);
            setSizes(copydata)
        })
    }, [props.product])

    const styleToast = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }

    const notifySuccess = (text) => {
        toast.success(text, styleToast)
    };
    const notifyWarning = (text) => {
        toast.warning(text, styleToast);
    };
    const notifyError = (text) => {
        toast.error(text, styleToast);
    };

    const toggle = () => {
        toggleModal()
        setProduct({})
        setSizes([
            {
                title: 36,
                status: false
            },
            {
                title: 37,
                status: false
            },
            {
                title: 38,
                status: false
            },
            {
                title: 39,
                status: false
            },
            {
                title: 40,
                status: false
            },
            {
                title: 41,
                status: false
            },
            {
                title: 42,
                status: false
            },
            {
                title: 43,
                status: false
            },
            {
                title: 44,
                status: false
            },
            {
                title: 45,
                status: false
            },
            {
                title: 46,
                status: false
            },
        ])
    }


    const toggleSize = async (id) => {
        setIsSizeModal(!isSizeModal)
        setSizePro({})
        setSizeProQuantity({})
        setSizeSelect(id)
    }

    const toggleImage = async (id) => {
        setisImageModal(!isImageModal)
        setImageURL()
        setImageUpload()
        setImage({})
    }

    const handleOnchangeFile = (event) => {
        let copy = { ...media };
        copy['id'] = image.id;
        copy['url'] = event.target.files[0].name;
        copy['type'] = 'image';
        copy['productId'] = product.id;
        setMedia({
            ...copy
        })
    }

    const handleOnchangeinput = (event) => {
        let copy = { ...sizeProQuantity };
        copy['productId'] = product.id;
        copy['size'] = sizeSelect;
        copy['quantity'] = event.target.value;
        setSizeProQuantity({
            ...copy
        })
    }

    const checkQuantitySize = () => {
        let totalQuantitySize = 0
        product.sizes.map(item => { totalQuantitySize += item.quantity })
        console.log(totalQuantitySize);
        console.log(product.quantity);
        if (totalQuantitySize + Number(sizeProQuantity.quantity) > product.quantity) {
            notifyWarning('Quantity > Quantity Pro')
            return false
        }
        return true
    }

    const createSizePro = async () => {
        try {
            if (checkQuantitySize()) {
                const res = await axios.post(`http://localhost:8080/api/size/post`, sizeProQuantity)
                let copydata = sizes;
                let getIndex = copydata.findIndex((p) => { return p.title == res.data.size });
                let size = { id: res.data.id, title: res.data.size, quantity: res.data.quantity, status: true }
                copydata.fill(size, getIndex, getIndex + 1);
                setSizes(copydata)
                // set product.sizes
                let copydataProduct = product;
                copydataProduct.sizes.push(res.data);
                setProduct(copydataProduct)
                notifySuccess('Create Success')
                toggleSize()
            }
        } catch (error) {
            console.log(error.message)
            notifyError('Created Error')
        }
    }

    const updateSizePro = async () => {
        try {
            if (checkQuantitySize()) {
                const res = await axios.put(`http://localhost:8080/api/size/put/${sizePro.id}`, sizeProQuantity)
                let copydataSize = sizes;
                let getIndexSize = copydataSize.findIndex((p) => { return p.title == res.data.size });
                let size = { id: res.data.id, title: res.data.size, quantity: res.data.quantity, status: true }
                copydataSize.fill(size, getIndexSize, getIndexSize + 1);
                setSizes(copydataSize)
                // set product.sizes
                let copydataProduct = product;
                let getIndex = copydataProduct.sizes.findIndex((p) => { return p.id == res.data.id });
                copydataProduct.sizes.fill(res.data, getIndex, getIndex + 1);
                setProduct(copydataProduct)
                notifySuccess('Update Success')
                toggleSize()
            }
        } catch (error) {
            console.log(error.message)
            notifyError('Update Error')
        }
    }

    const createImage = async () => {
        try {
            handleUpdateImages()
            const res = await axios.post(`http://localhost:8080/api/media/create`, [media])
            let copydata = product;
            copydata.medias.push(res.data[0]);
            setProduct(copydata)
            notifySuccess('Create Success')
            toggleImage()
            navigate('/admin/product')
        } catch (error) {
            console.log(error.message)
            notifyError('Created Error')
        }
    }

    const updateImage = async () => {
        try {
            handleUpdateImages()
            let res = await axios.put(`http://localhost:8080/api/media/update`, media)
            let copydata = product;
            let getIndex = copydata.medias.findIndex((p) => { return p.id == res.data.id });
            copydata.medias.fill(res.data, getIndex, getIndex + 1);
            let productz = { ...copydata, image: copydata.medias[0].url }
            // setMedia(copydata)
            updateData(productz, '', 'update')
            notifySuccess('Update Success')
            toggleImage()
        } catch (error) {
            console.log(error.message)
            notifyError('Update Error')
        }
    }

    const findSizeById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/size/find/${id}`)
            console.log(res.data);
            setSizePro(res.data)
            let copy = { ...sizeProQuantity };
            copy['productId'] = product.id;
            copy['quantity'] = res.data.quantity;
            setSizeProQuantity({
                ...copy
            })
        } catch (error) {
            console.log(error.message)
            notifyError('ERROR!!!')
        }
    }

    const findImageById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/media/findById/${id}`)
            setImage(res.data)
            imageUrls.map((img) => {
                if (img.nameImg === res.data.url) {
                    return setImageURL(img.url)
                }
            })
        } catch (error) {
            console.log(error.message)
            notifyError('ERROR!!!')
        }
    }

    return (
        <div>
            <Modal isOpen={isDetailsModal} toggle={() => toggle()} size='xl' centered>
                <ModalHeader toggle={() => toggle()}>Details Product</ModalHeader>
                <ModalBody>
                    <div className="product-details row">
                        <div className="product-details-left row col-lg-7 pt-3">
                            <div className="product-details-left-small-img">
                                {product.name?.length > 0 && imageUrls.map((img, index1) => {
                                    return (
                                        product.medias.map((item, index2) => {
                                            return (
                                                <>
                                                    {index2 > 0 &&
                                                        img.nameImg === item.url &&
                                                        <img onClick={() => { findImageById(item.id); toggleImage() }} src={img.url} style={{ height: '88.25px', width: '88.25px', padding: '3px 0px 3px 0px' }} />
                                                    }
                                                </>
                                            )
                                        })
                                    )
                                })}
                                {product.medias?.length < 5 &&
                                    <img onClick={() => { toggleImage() }} style={{ height: '88.25px', width: '88.25px', padding: '3px 0px 3px 0px' }} />
                                }
                            </div>
                            <div className="product-details-left-big-img">
                                {product.name?.length > 0 && imageUrls.map((img, index1) => {
                                    return (
                                        product.medias.map((item, index2) => {
                                            return (
                                                <>
                                                    {index2 === 0 && img.nameImg === item.url &&
                                                        <img onClick={() => { findImageById(item.id); toggleImage() }} src={img.url} style={{ height: '353px', width: '100%' }} />
                                                    }
                                                </>
                                            )
                                        })
                                    )
                                })}
                            </div>
                        </div>
                        <div className="product-details-right col-lg-5">
                            <div className="product-details-right-product-name">
                                <h1>{product.name}</h1>
                            </div>
                            <div className="product-details-right-product-color">
                                <p className="color"><span className="colorDetails">Color: </span>{product.color}</p>
                            </div>
                            <div className="product-details-right-product-color">
                                <p className="color"><span className="colorDetails">Cate: </span>{product.name_cate}</p>
                            </div>
                            <div className="product-details-right-product-price">
                                <p><span className="priceDetails">Price: </span>{product.price}<sup>đ</sup></p>
                            </div>

                            <div className="product-details-right-product-size row">
                                <div className="col-lg-1">
                                    <span className="SizeDetails">Size: </span>
                                </div>
                                <div className="col-lg-11 sizeDetai">
                                    {sizes.map((item, index1) => {
                                        if (item.quantity > 0 && item.status == true) {
                                            return <button onClick={(e) => { toggleSize(item.title); findSizeById(item.id) }} className="btn">{item.title}</button>
                                        } else if (item.quantity <= 0 && item.status == true) {
                                            return <button onClick={(e) => { toggleSize(item.title); findSizeById(item.id) }} className="btn" style={{ borderColor: 'white', color: '#b6b6b6fe' }} >{item.title}</button>
                                        } else if (item.status === false) {
                                            return <button onClick={(e) => { toggleSize(item.title) }} className="btn" style={{ borderColor: 'white', color: '#b6b6b6fe' }} >{item.title}</button>
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="product-details-right-product-quantity">
                                <span className="quantityLeft">Quantity: </span><span>{product.quantity}</span>
                            </div>
                            <div className="product-details-right-product-created">
                                <span className="createdLeft">Created: </span>
                                <span className="creatorLeft">{moment(product.created).format('DD/MM/YYYY HH:mm:ss')} - {product.creator}</span>
                            </div>
                            <div className="product-details-right-product-modified">
                                <span className="modifiedLeft">Modified: </span>
                                <span className="modifierLeft">{product.modified ? moment(product.modified).format('DD/MM/YYYY HH:mm:ss') : ''} - {product.modifier}</span>
                            </div>
                            {/* <div className="product-details-right-product-button">
                            <button class="fas fa-cart-arrow-down btnGioHang"> Update</button>
                        </div> */}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="primary" onClick={toggleModal}>
                Do Something
                </Button>{' '} */}
                    <Button color="secondary" onClick={() => toggle()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isSizeModal} toggle={() => toggleSize()} centered>
                <ModalHeader toggle={() => toggleSize()}>Size {sizeSelect}</ModalHeader>
                <ModalBody>
                    <Label for="description">
                        Quantity
                    </Label>
                    <div>
                        <input value={sizeProQuantity.quantity} onChange={(e) => handleOnchangeinput(e)}
                            style={{ border: '1px solid', width: '100%', borderRadius: '5px' }}
                        />
                    </div>
                </ModalBody>
                <ModalFooter>
                    {sizePro.id > 0 &&
                        <Button color="primary" onClick={() => updateSizePro()}>
                            Save
                        </Button>
                    }
                    {!sizePro.id > 0 &&
                        <Button color="primary" onClick={() => createSizePro()}>
                            Created
                        </Button>
                    }
                    <Button color="secondary" onClick={() => toggleSize()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isImageModal} toggle={() => toggleImage()} centered>
                <ModalHeader toggle={() => toggleImage()}>Image</ModalHeader>
                <ModalBody>
                    <Input
                        id="image"
                        name="image"
                        type="file"
                        // value={user.image}
                        onChange={(event) => { handleOnchangeFile(event, 'image'); setImageUpload(event.target.files[0]); handleImages(event) }}
                        style={{ marginBottom: '10px' }}
                    />
                    <div>
                        {!imageUpload &&
                            <img width='100%' height='350rem' src={imageURL} />
                        }
                        {imageUpload &&
                            <img width='100%' height='350rem' src={URL.createObjectURL(imageUpload)} />
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    {image.id > 0 &&
                        <Button color="primary" onClick={() => updateImage()}>
                            Save
                        </Button>
                    }
                    {!image.id > 0 &&
                        <Button color="primary" onClick={() => createImage()}>
                            Created
                        </Button>
                    }
                    <Button color="secondary" onClick={() => toggleImage()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
export default ProductDetails;