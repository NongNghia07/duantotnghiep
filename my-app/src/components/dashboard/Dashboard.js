import { React, useState, useEffect } from 'react';
import statusCards from "../../assets/JsonData/status-card-data.json";
import StatusCard from "../status-card/StatusCard";
// import Chart from "react-apexcharts";
import { Link, NavLink } from "react-router-dom";
import PaginatedItems from "../../customHook/PaginatedItems";
import axios from 'axios';

const Dashboard = () => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common = { 'Authorization': `Bearer ${token}` }
    const [product, setProduct] = useState([]);
    const [year, setYear] = useState([]);
    const [countOr, setCountOr] = useState();
    const [total, setTotal] = useState();
    const [countAcc, setCountAcc] = useState();
    const [countPro, setCountPro] = useState();
    const [seri, setSeri] = useState([]);
    const [option, setOption] = useState({});


    const findAllPro = async () => {
        const res = await axios.get(`http://localhost:8080/billDetail/findAll`,
            { headers: { "Authorization": `Bearer ${token}` } })
        let data = res ? res.data : []
        setProduct(data)
    }

    useEffect(() => {
        findAllPro()
    }, [])

    useEffect(() => {
        // reportByProduct(1, 8)
        //     .then((resp) => {
        //         setProduct(resp.data.content);
        //     })
        //     .catch((error) => console.log(error));

        // reportAmountYear()
        //     .then((resp) => {
        //         setYear(resp.data);
        //         const result = resp.data.reduce((price, item) => price + item.total, 0);
        //         setTotal(result);
        //     })
        //     .catch((error) => console.log(error));

        // countOrder()
        //     .then((resp) => setCountOr(resp.data))
        //     .catch((error) => console.log(error));

        // countAccount()
        //     .then((resp) => setCountAcc(resp.data))
        //     .catch((error) => console.log(error));

        // countProduct()
        //     .then((resp) => setCountPro(resp.data))
        //     .catch((error) => console.log(error));

        // countOrderByName()
        //     .then((resp) => {
        //         const x = resp.data.map((item) => item.name);
        //         setOption({
        //             labels: x,
        //         });
        //         const y = resp.data.map((item) => item.count);
        //         setSeri(y);
        //     })
        //     .catch((error) => console.log(error));
        setOption(
            {
                labels: ['Ch??a thanh to??n', '???? thanh to??n', '??ang Giao', 'Giao Th??nh C??ng', '???? H???y']
            }
        );
        setSeri([12, 21, 56, 23, 32]);
    }, []);

    const pageable = () => {

    }

    return (
        <div>
            <h2 className="page-header">Th???ng k??</h2>
            <div className="row">
                <div className="col-6 ">
                    <div className="card">
                        <StatusCard
                            icon={statusCards[0].icon}
                            // count={countAcc}
                            count='10'
                            title={`Kh??ch h??ng`}
                        />
                        <StatusCard
                            icon={statusCards[1].icon}
                            count={'30'}
                            title={`S???n ph???m`}
                        />
                        <StatusCard
                            icon={statusCards[3].icon}
                            count={'40'}
                            title={`????n h??ng`}
                        />
                        <StatusCard
                            icon={statusCards[2].icon}
                            count={'200'}
                            title={`T???ng doanh thu`}
                        />
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        {/* <Chart options={option} series={seri} type="donut" height="100%" /> */}
                    </div>
                </div>
                <div className="col-6">
                    <div className="card">
                        <div className="card__header">
                            <h3 className="text-primary">Doanh thu theo s???n ph???m</h3>
                        </div>
                        <div className="card__body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">M??</th>
                                        <th scope="col">T??n s???n ph???m</th>
                                        <th scope="col">S??? l?????ng b??n</th>
                                        <th scope="col">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product &&
                                        product.map((item, index) => (
                                            <tr key={item.id_Pro}>
                                                <th scope="row">
                                                    <NavLink to={`/productOne/${item.id_Pro}`} exact>
                                                        {" "}
                                                        {item.id_Pro}
                                                    </NavLink>
                                                </th>
                                                <td>{item.name_Pro}</td>
                                                <td>{item.totalQuantityPro}</td>
                                                <td>{item.totalPricePro.toLocaleString()} ??</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <PaginatedItems itemsPerPage={30}
                                pageable={pageable} />
                        </div>
                        <div className="card__footer">
                            <Link to="/report-product">Xem chi ti???t</Link>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card">
                        <div className="card__header">
                            <h3 className="text-primary">Doanh thu theo N??m</h3>
                        </div>
                        <div className="card__body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">STT</th>
                                        <th scope="col">N??m</th>
                                        <th scope="col">S??? l?????ng ????n</th>
                                        <th scope="col">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {year &&
                                        year.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">
                                                    <NavLink exact to={`/report-month/${item.year}`}>
                                                        {index + 1}
                                                    </NavLink>
                                                </th>
                                                <td>{item.year}</td>
                                                <td>{item.count}</td>
                                                <td>{item.total && item.total.toLocaleString()} ??</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <PaginatedItems itemsPerPage={30}
                                pageable={pageable} />
                        </div>
                        <div className="card__footer">
                            <NavLink exact to={`/report-month/2022`}>
                                Xem chi ti???t
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;