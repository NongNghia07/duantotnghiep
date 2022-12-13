import { React, useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  getMetadata,
} from "firebase/storage";
import { storage } from "../../Firebase";
import axios from "axios";
import "../css/ship.css";
import useCallGetAPI from "../../customHook/CallGetApi";
import "../bill/bill.css";
import Badge from "@mui/material/Badge";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Form,
} from "reactstrap";
import { width } from "@mui/system";
import { CgFormatJustify } from "react-icons/cg";
import { async } from "@firebase/util";

// class Bill extends React.Component {
const Bill = (props) => {
  const { updateData } = props;
  const [lstproduct, setLstProduct] = useState([]);
  const { data: dataCart } = useCallGetAPI(
    `http://localhost:8080/cart/getCart?user_Id=`
  );
  const [totalPrice, setTotalPrice] = useState();
  const [lstcart, setLstCart] = useState([]);
  const [source, setSource] = useState();
  const [number, setNumber] = useState({});

  const [imageUrls, setImageUrls] = useState([]);

  const [Products, setProducts] = useState("null");
  const [user, setUser] = useState({});
  const [isModalVoucher, setIsModalVoucher] = useState(false);
  const { data: dataVoucher, isLoading } = useCallGetAPI(
    `http://localhost:8080/api/voucher/get`
  );
  //const [lstVoucher, setLstVoucher] = useState([]);

  //const [voucherSelect, setVoucherSelect] = useState({});
  const [sealer, setSealer] = useState();
  const imagesListRef = ref(storage, "images/");
  const [account, setAccount] = useState({
    Email: "",
    Name: "",
    Phone_Number: "",
    Address: "",
    Description: "",
  });
  const [check, setCheck] = useState({});
  const vnpay = [
    {
      title: "Ngân hàng",
      card: "NCB",
    },
    {
      title: "Loại thẻ quốc tế",
      card: "VISA",
    },
    {
      title: "Loại thẻ quốc tế",
      card: "MasterCard",
    },
  ];
  // const [user, setUser] = useState({})
  const handleOnchangeInput = (e, id) => {
    let copy = { ...account };
    copy[id] = e.target.value;
    try {
      let ch0 = { ...check };
      let vnf_regex = /((09|03|07|08|028|024|05)+([0-9]{8})\b)/g;
      let re = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;

      if (id == "Email") {
        if (re.test(e.target.value) == false) {
          //ch0["email"] = "This is a valid email address";
          ch0["Email"] = "Invalid email, please enter correct email format";
        } else {
          ch0["Email"] = "";
        }
        setCheck({
          ...ch0,
        });
      } else {
        if (id == "Name") {
          console.log(copy[id]);
          if (copy[id] == 0) {
            ch0[id] = "Name not null";
          } else {
            ch0[id] = "";
          }
        } else if (id == "Phone_Number") {
          if (copy[id] == 0) {
            ch0["Phone_Number"] = "Phone Number not null";
          } else {
            if (vnf_regex.test(e.target.value) == false) {
              ch0["Phone_Number"] = "please enter correct phone format";
            } else {
              ch0["Phone_Number"] = "";
            }
          }
        } else if (id == "Address") {
          if (copy[id] == 0) {
            ch0["Address"] = "Address not null";
          } else {
            ch0["Address"] = "";
          }
        } else {
          ch0[id] = "";
        }
        setCheck({
          ...ch0,
        });
      }
    } catch (error) {
      // let ch0 = { ...check };
      // ch0[id] = `${id} không được để trống !!`
      console.log(error);
      // setCheck({
      //     ...ch0
      // })
    }
    setAccount({
      ...copy,
    });
  };
  const thanhToan = () => {
    try {
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    let total = 0;
    const setTotal = () => {
      setLstCart(dataCart);
      dataCart.map((item) => {
        total += item.price * item.quantity;
      });
      setTotalPrice(total);
    };
    dataCart && setTotal();
    // setLstVoucher(dataVoucher);
  }, [dataCart /*dataVoucher*/]);

  useEffect(() => {
    setImageUrls([]);
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        let nameImg = item.name;
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, { nameImg, url }]);
        });
      });
    });
  }, []);

  const createOrder = async () => {
    let ch0 = { ...check };
    if (account.Email == 0) {
      ch0["Email"] = "Email not null";
      setCheck({ ...ch0 });
    } else if (check.Email == 0) {
      ch0["Email"] = "";
      setCheck({ ...ch0 });
    }
    if (account.Name == 0) {
      ch0["Name"] = "Name not null";
      setCheck({ ...ch0 });
    } else if (check.Name == 0) {
      ch0["Name"] = "";
      setCheck({ ...ch0 });
    }
    if (account.Phone_Number == 0) {
      ch0["Phone_Number"] = "Phone_Number not null";
      setCheck({ ...ch0 });
    } else if (check.Phone_Number == 0) {
      ch0["Phone_Number"] = "";
      setCheck({ ...ch0 });
    }
    if (account.Address == 0) {
      ch0["Address"] = "Address not null";
      setCheck({ ...ch0 });
    } else if (check.Address == 0) {
      ch0["Address"] = "";
      setCheck({ ...ch0 });
    }
    if (
      check.Email == 0 ||
      check.Name == 0 ||
      check.Phone_Number == 0 ||
      check.Address == 0
    ) {
      return;
    }
    let res = await axios.post(
      `http://localhost:8080/order/createNoUser?voucher_Id=`,
      user
    );
    window.location.href = `http://localhost:8080/thanh-toan-vnpay?amount=${totalPrice}&bankcode=NCB&language=vi&txt_billing_mobile=${user.telephone}&txt_billing_email=${user.email}&txt_billing_fullname=${user.nameRecipient}&txt_inv_addr1=${user.address}&txt_bill_city=ha%20noi&txt_bill_country=viet%20nam&txt_bill_state=ha%20noi&txt_inv_mobile=0389355471&txt_inv_email=quanganhsaker@gmail.com&txt_inv_customer=Nguy%E1%BB%85n%20Van%20A&txt_inv_addr1=ha%20noi&city&txt_inv_company=fsoft&txt_inv_taxcode=10&cbo_inv_type=other&vnp_OrderType=other&vnp_OrderInfo=order%20info%20test`;
  };

  const toggle = () => {
    setIsModalVoucher(!isModalVoucher);
  };

  const addVoucher = async () => {
    let radio = document.getElementsByClassName("voucher");
    for (let i = 0; i < radio.length; i++) {
      if (radio.item(i).checked) {
        let res = await axios.get(
          `http://localhost:8080/api/voucher/get/${radio.item(i).value}`
        );
        // setVoucherSelect(res.data);
        let total = 0;
        let totalSealer = 0;

        dataCart.map((item) => {
          total += item.price * item.quantity;

          if (item.category_Id === res.data.categoryId) {
            totalSealer += item.price;
          }
        });
        if (res.data.type === 1) {
          total = total - (totalSealer * res.data.value) / 100;
          setSealer((totalSealer * res.data.value) / 100);
        } else {
          total = totalSealer - res.data.value;
          setSealer(res.data.value);
        }
        setTotalPrice(total);
        toggle();
        return;
      } else {
        let total = 0;

        dataCart.map((item) => {
          total += item.price * item.quantity;
        });
        setTotalPrice(total);
        //setVoucherSelect(0);
        setSealer();
      }
      toggle();
    }
  };

  return (
    <>
      <section>
        <MDBContainer>
          <MDBRow className="justify-content-center align-items-center">
            <MDBCol>
              <MDBCard className="card-stepper text-black">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBTypography tag="h5">
                        Code orders{" "}
                        <span className="text-primary font-weight-bold">
                          #Y34XDHR
                        </span>
                      </MDBTypography>
                    </div>
                    <div className="text-end">
                      <p>
                        Estimated Delivery:<span>01/12/2022</span>
                      </p>
                      <p>
                        Bill of Lading Code:{" "}
                        <span className="font-weight-bold">
                          234094567242423422898
                        </span>
                      </p>
                    </div>
                  </div>
                  <ul
                    id="progressbar-2"
                    className="d-flex justify-content-between mx-0 mt-0 mb-5 px-0 pt-0 pb-2"
                  >
                    <li className="step0 active text-center" id="step1"></li>
                    <li className="step0 active text-center" id="step2"></li>
                    <li className="step0 active text-center" id="step3"></li>
                    <li className="step0 text-muted text-end" id="step4"></li>
                  </ul>

                  <div className="d-flex justify-content-between">
                    <div className="d-lg-flex align-items-center">
                      <MDBIcon
                        fas
                        icon="clipboard-list me-lg-4 mb-3 mb-lg-0"
                        bssize="3x"
                      />
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">Processed</p>
                      </div>
                    </div>
                    <div className="d-lg-flex align-items-center">
                      <MDBIcon
                        fas
                        icon="box-open me-lg-4 mb-3 mb-lg-0"
                        bssize="3x"
                      />
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">Shipped</p>
                      </div>
                    </div>
                    <div className="d-lg-flex align-items-center">
                      <MDBIcon
                        fas
                        icon="shipping-fast me-lg-4 mb-3 mb-lg-0"
                        bssize="3x"
                      />
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">En Route</p>
                      </div>
                    </div>
                    <div className="d-lg-flex align-items-center">
                      <MDBIcon
                        fas
                        icon="home me-lg-4 mb-3 mb-lg-0"
                        bssize="3x"
                      />
                      <div>
                        <p className="fw-bold mb-1">Order</p>
                        <p className="fw-bold mb-0">Arrived</p>
                      </div>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <Row
        className="row-cart"
        style={{ overflow: "unset", padding: "1%", background: "gray" }}
      >
        <Col md={7} style={{ padding: "1%", marginTop: "2%" }}>
          <div>
            <h3>Receiver's information</h3>
          </div>
          <Form style={{ padding: "0% 0% 0% 5%" }}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder=""
                    type="text"
                    onChange={(event) => handleOnchangeInput(event, "Email")}
                  />
                  {check.Email && check.Email.length > 0 && (
                    <p className="checkError1">{check.Email}</p>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="color">Name</Label>
                  <Input
                    id="nameRecipient"
                    name="nameRecipient"
                    placeholder=""
                    type="text"
                    onChange={(event) => handleOnchangeInput(event, "Name")}
                  />
                  {check.Name && check.Name.length > 0 && (
                    <p className="checkError1">{check.Name}</p>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="number Number phone">Phone Number</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    placeholder=""
                    type="text"
                    onChange={(event) =>
                      handleOnchangeInput(event, "Phone_Number")
                    }
                  />
                  {check.Phone_Number && check.Phone_Number.length > 0 && (
                    <p className="checkError1">{check.Phone_Number}</p>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder=""
                    type="text"
                    onChange={(event) => handleOnchangeInput(event, "Address")}
                  />
                  {check.Address && check.Address.length > 0 && (
                    <p className="checkError1">{check.Address}</p>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    type="textarea"
                    bssize="lg"
                    onChange={(event) =>
                      handleOnchangeInput(event, "Description")
                    }
                  />
                  {check.Description && check.Description.length > 0 && (
                    <p className="checkError1">{check.Description}</p>
                  )}
                </FormGroup>
                <div>Payment methods</div>
                <Input type="select">
                  {vnpay.map((item) => {
                    return (
                      <option>
                        {item.title} - {item.card}
                      </option>
                    );
                  })}
                </Input>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col
          md={5}
          style={{
            boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            borderRadius: "15px",
            padding: "1%",
          }}
        >
          <h3>ORDERS</h3>
          {lstcart.map((lstcart, index) => {
            return (
              <>
                <Row style={{ marginBottom: "5px" }}>
                  <Col md={3}>
                    {imageUrls.map((img, index1) => {
                      return lstcart.media.map((item, index2) => {
                        return (
                          img.nameImg === item.url &&
                          index2 === 0 && (
                            <Badge
                              badgeContent={lstcart.quantity}
                              color="primary"
                            >
                              <img src={img.url} width="150px" height="100px" />
                            </Badge>
                          )
                        );
                      });
                    })}
                  </Col>
                  <Col md={6}>
                    <p>
                      {lstcart.name_Product} / {lstcart.sizeName}
                    </p>
                  </Col>
                  <Col md={3}>
                    <p>{lstcart.price * lstcart.quantity}</p>
                  </Col>
                </Row>
              </>
            );
          })}

          <div
            style={{
              display: "flex",
              width: "70%",
              marginLeft: "5%",
              float: "left",
              justifyContent: "space-between",
            }}
          >
            {/* {lstVoucher.map((item, index) => {
              if (item.id == voucherSelect) {
                return (
                  <>
                    <div>{item.name}</div>
                    <div>
                      {item.type === 1 ? item.value + "%" : item.value + "K"}
                    </div>
                    <div>{item.namecate}</div>
                  </>
                );
              }
            })} */}
          </div>
          <button
            style={{
              float: "right",
              display: "inline-block",
              marginRight: "10px",
            }}
            type="button"
            onClick={() => toggle()}
          >
            Select Voucher
          </button>
          <Modal
            isOpen={isModalVoucher}
            toggle={() => toggle()}
            bssize="lg"
            centered
          >
            <ModalHeader toggle={() => toggle()}>Voucher</ModalHeader>
            <ModalBody>
              {/* <Row>
                {lstVoucher.map((item, index) => {
                  if (
                    item.status != 0 &&
                    Number(item.status) > 0 &&
                    new Date(new Date(item["effectFrom"]).toDateString()) <=
                      new Date(new Date().toDateString()) &&
                    new Date(new Date(item["effectUntil"]).toDateString()) >=
                      new Date(new Date().toDateString())
                  ) {
                    return (
                      <Col
                        md={12}
                        style={{
                          borderBottom: "1px solid",
                          marginBottom: "5px",
                        }}
                      >
                        <Row>
                          <Col md={6}>
                            <span>{item.name}</span>
                            <span
                              style={{
                                marginLeft: "auto",
                                marginRight: "0px",
                                float: "right",
                              }}
                            >
                              Còn {item.quantity} voucher
                            </span>
                            <p>{item.namecate}</p>
                          </Col>
                          <Col md={5}>{item.effectUntil}</Col>
                          <Col md={1}>
                            <input
                              type="radio"
                              className="voucher"
                              value={item.id}
                            />
                          </Col>
                        </Row>
                      </Col>
                    );
                  }
                })}
              </Row> */}
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => {
                  addVoucher();
                }}
              >
                Ok
              </Button>
              <Button color="secondary" onClick={() => toggle()}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <div className="cart-right col-4 bg-light">
            <div className="summary">
              <ul>
                <li>
                  Total: <span>{totalPrice}</span>
                </li>
                <li>
                  Sale: <span>{sealer}</span>
                </li>
                <li className="total">
                  Total: <span>{lstcart.length}</span> Products
                </li>
              </ul>
            </div>

            <div className="checkout">
              <button
                type="submit"
                onClick={(e) => {
                  createOrder(e);
                }}
              >
                ORDER
              </button>{" "}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Bill;
