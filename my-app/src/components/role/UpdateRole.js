import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../voucher/voucher.css';
import axios from 'axios';
import useCallGetAPI from '../../customHook/CallGetApi';
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify';

const UpdateRole = (props) => {

    const token = localStorage.getItem('token');
    const { isupdateRolleModal, toggleModal, updateData } = props;
    const [role, setRole] = useState(props.role);
    const [lstcate, setLstCate] = useState([]);
    const { data: cates } = useCallGetAPI(`http://localhost:8080/api/category/get`, { headers: { "Authorization": `Bearer ${token}` } });
    const [check, setCheck] = useState({ name: '', value: '', quantity: '', type: 1, categoryId: '' });
    const status = [{
        id: 1,
        title: "Hoạt động",
    }, {
        id: 0,
        title: "Không hoạt động",
    },
    ];

    useEffect(() => {
        setLstCate(cates)
    }, [cates])

    useEffect(() => {
        setRole(props.role)

    }, [props.role])

    const handleOnchangeInput = (event, id) => {
        let copyVoucher = { ...role };
        copyVoucher[id] = event.target.value;
        try {

            let ch1 = { ...check };
            if (copyVoucher[id].trim().length <= 0) {
                ch1[id] = `${id} không được để trống !!`
                if (id == "value") {
                    ch1[id] = "Giảm giá không được để trống !!"
                }
                setCheck({
                    ...ch1
                })
            } else {
                if (id == "value" || id == "quantity") {
                    if (Number(copyVoucher[id]) <= 0) {
                        ch1[id] = id == "value" ? "Giảm giá phải lớn hơn 0 !!" : "Lượt sử dụng phải lớn hơn 0 !!"
                    } else {
                        ch1[id] = ""
                    }
                }
                setCheck({
                    ...ch1
                })
            }
        } catch (error) {
            let ch1 = { ...check };
            ch1[id] = `${id} không được để trống !!`
            console.log(error);
            setCheck({
                ...ch1
            })
        }
        // console.log(event.target[event.target.selectedIndex].value)
        setRole({
            ...copyVoucher
        })
    }

    const notifySuccess = (text) => {
        toast.success(text, styleToast)
    };
    const notifyWarning = (text) => {
        toast.warning(text, styleToast);
    };
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
    console.log(role);

    const updateVoucher = async () => {
        try {
            let ch1 = { ...check };
            let value = "" + role.value
            let quantity = "" + role.quantity
            if (role.name?.trim().length <= 0
                && value.trim().length <= 0
                && quantity.trim().length <= 0
            ) {
                ch1["name"] = "Tên không để trống"
                ch1["value"] = "Giảm giá không để trống"
                ch1["quantity"] = "Lượt sử dụng không để trống"
                setCheck({ ...ch1 })
                return
            } else if (role.name?.trim().length <= 0) {
                ch1["name"] = "Tên không để trống"
                setCheck({ ...ch1 })
                return
            }
            else if (value.trim().length <= 0) {
                ch1["value"] = "Giảm giá không để trống"
                setCheck({ ...ch1 })
                return
            }
            else if (quantity.trim().length <= 0) {
                ch1["quantity"] = "Lượt sử dụng không để trống"
                setCheck({ ...ch1 })
                return
            }
            else if (
                check.name?.trim().length > 0
                || check.value.trim().length > 0
                || check.quantity.trim().length > 0
            ) {
                return
            }
            const res = await axios.put(`http://localhost:8080/api/voucher/update/${role.id}`, role,
                { headers: { "Authorization": `Bearer ${token}` } })
            let data = (res && res.data) ? res.data : [];
            toggle()
            updateData(data, 'update')
            notifySuccess("Cập nhập thành công")
        } catch (error) {
            console.log(error.message);
        }
    }


    const toggle = () => {
        toggleModal()
        setRole({})
        setCheck({})
    }
    return (
        <div>
            <ToastContainer />
            <Modal isOpen={isupdateRolleModal} toggle={() => toggle()} size='lg' centered>
                <ModalHeader toggle={() => toggle()}>Cập Nhập</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-10 offset-1">
                            <form className="needs-validation">
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label className="form-label">Tên</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder=""
                                            id="roleName"
                                            name="roleName"
                                            required
                                            value={role.roleName}
                                            onChange={(event) => handleOnchangeInput(event, 'roleName')} />
                                        {check.roleName && check.roleName.length > 0 && <p className="checkError">{check.roleName}</p>}
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label">Phần giá chiết khấu</label>
                                        <input
                                            type="number"
                                            placeholder=""
                                            className="form-control"
                                            min={0}
                                            max={100}
                                            id="value"
                                            name="value"
                                            value={role.value}
                                            onChange={(event) => handleOnchangeInput(event, 'value')}
                                        />
                                        {check.value && check.value.length > 0 && <p className="checkError">{check.value}</p>}
                                        {/* {errors.discount && (
                                        <div className="alert alert-danger" role="alert">
                                            Giảm giá không hợp lệ!
                                        </div>
                                    )} */}
                                    </div>
                                    <div className="col-sm-6 mt-5">
                                        <label className="form-label">Lượt sử dụng</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min={0}
                                            placeholder=""
                                            id="quantity"
                                            name="quantity"
                                            value={role.quantity}
                                            onChange={(event) => handleOnchangeInput(event, 'quantity')}
                                        // {...register("count", {
                                        //     required: true,
                                        //     min: 0,
                                        // })}
                                        />
                                        {check.quantity && check.quantity.length > 0 && <p className="checkError">{check.quantity}</p>}
                                        {/* {errors.count && (
                                        <div className="alert alert-danger" role="alert">
                                            Lượt sử dụng không hợp lệ!
                                        </div>
                                    )} */}
                                    </div>
                                    <div className="col-sm-6 mt-5">
                                        <label className="form-label">Trạng thái</label>
                                        <select
                                            className="form-control"
                                            id="status"
                                            name="status"
                                            placeholder=""
                                            value={role.status}
                                            onChange={(event) => handleOnchangeInput(event, 'status')}
                                        // {...register("isActive", { required: false })}
                                        >
                                            {/* {voucher.status === 1 &&
                                                <>
                                                    <option selected value={1}>Hoạt động</option>
                                                    <option value={0}>Không hoạt động</option>
                                                </>
                                            }
                                            <option value='1'>Hoạt động</option>
                                            <option value='0'>Không hoạt động</option>
                                            {voucher.status === 0 &&
                                                <>
                                                    <option value={1}>Hoạt động</option>
                                                    <option selected value={0}>Không hoạt động</option>
                                                </>
                                            } */}
                                            {status.map(item => {
                                                if (role.status === item.id) {
                                                    return <option selected value={item.id}>{item.title}</option>
                                                }
                                                return <option value={item.id}>{item.title}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-sm-12 mt-5">
                                        <label className="form-label">Danh mục</label>
                                        <select
                                            className="form-control"
                                            id="categoryId"
                                            name="categoryId"
                                            placeholder=""
                                            onChange={(event) => handleOnchangeInput(event, 'categoryId')}
                                        >
                                            {lstcate.map((item, index) => {
                                                if (item.id === role.categoryId) {
                                                    return (
                                                        <option key={index} value={item.id} selected>
                                                            {item.namecate}
                                                        </option>
                                                    )
                                                }
                                                return (
                                                    <option key={index} value={item.id} >
                                                        {item.namecate}
                                                    </option>
                                                )

                                            })}
                                        </select>
                                    </div>
                                    <div className="col-sm-12 mt-5">
                                        <label className="form-label">Mô tả</label>
                                        <textarea
                                            type="description"
                                            // min="2022-01-01"
                                            // max="2023-01-01"
                                            className="form-control"
                                            id="description"
                                            value={role.description}
                                            onChange={(event) => handleOnchangeInput(event, 'description')}
                                        // {...register("expireDate", {
                                        //     required: true,
                                        // })}
                                        />
                                    </div>

                                </div>
                                {/* <button
                                    className="btn btn-primary btn-lg mt-5 mb-5"
                                    type="submit"
                                    style={{ marginLeft: 80, borderRadius: 50 }}
                                >
                                    Cập nhật
                                </button> */}
                            </form>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={(e) => { updateVoucher(); }}>
                        Cập nhập
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleModal}>
                        Hủy bỏ
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
export default UpdateRole;