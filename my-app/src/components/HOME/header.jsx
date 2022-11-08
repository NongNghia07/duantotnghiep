import {React, useEffect} from "react";
import { NavLink } from "react-router-dom";
import '../css/stylees1.css';
// import Scrip from "./scripts";
import logo from '../image/logo.png';
const Header = () => {
    
    let navbar;
    let slides;
    let cart;
    let loginForm;
    let searchForm;
    useEffect(()=>{
        navbar = document.querySelector('.navbar');
        slides = document.querySelectorAll('.home .slides-container .slide');
        loginForm = document.querySelector('.login-form');
        cart = document.querySelector('.shopping-cart');
        searchForm = document.querySelector('.search-form');
    },[]);
     
    
    const searchbtn = () => {
        
        searchForm?.classList?.toggle('active');
        cart?.classList?.remove('active');
        loginForm?.classList?.remove('active');
        navbar?.classList?.remove('active');
    }
    
    
    const cartHover = () => {
        cart?.classList?.toggle('active');
        searchForm?.classList?.remove('active');
        loginForm?.classList?.remove('active');
        navbar?.classList?.remove('active');
    }
    const cartOutHover = () => {
        cart?.classList?.remove('active');
        searchForm?.classList?.remove('active');
        loginForm?.classList?.remove('active');
        navbar?.classList?.remove('active');
    }
    
    // document.querySelector('#login-btn').onclick = () =>{
        //     loginForm.classList?.toggle('active');
        //     searchForm?.classList?.remove('active');
        //     cart?.classList?.remove('active');
        //     navbar?.classList?.remove('active');
        // }
        
        
const menubtn = () => {
    navbar?.classList?.toggle('active');
    searchForm?.classList?.remove('active');
    cart?.classList?.remove('active');
    loginForm?.classList?.remove('active');
}

window.onscroll = () =>{
    searchForm?.classList?.remove('active');
    cart?.classList?.remove('active');
    loginForm?.classList?.remove('active');
    navbar?.classList?.remove('active');
}

let index = 0;

function next(){
    slides[index].classList?.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList?.add('active');
}

function prev(){
    slides[index].classList?.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList?.add('active');
}

    return (
        <header class="header">

            {/* <a href="home.html" class="logo"> <i class="fas fa-shopping-basket"></i> laTra shoes </a> */}
            <a href="home.html" class="logo"><img src={logo} alt="" width="50px" height="50px" /> laTra shoes </a>

            <nav class="navbar">
                <NavLink className="navbar-brand ps-3" to="/" activeClassName="active">Hom</NavLink>
                <NavLink className="navbar-brand ps-3" to="/shop" activeClassName="active">Shop</NavLink>
                <a href="about.html">about</a>
                <a href="review.html">review</a>
                <a href="blog.html">blog</a>
                <a href="contact.html">contact</a>
            </nav>

            <div class="icons">
                <div id="menu-btn" onClick={() => {menubtn()}} class="fas fa-bars"></div>
                <div id="search-btn" onClick={() => {searchbtn()}} class="fas fa-search"></div>
                <NavLink className="navbar-brand ps-3" to="/ProductOne" activeClassName="active"><div id="cart-btn" onMouseOver={() => {cartHover()}} onMouseLeave={() => {cartOutHover()}} class="fas fa-shopping-cart"></div></NavLink>
                <div id="login-btn" class="fas fa-user"></div>
            </div>

            <form action="" class="search-form">
                <input type="search" placeholder="search here..." id="search-box"/>
                    <label for="search-box" class="fas fa-search"></label>
            </form>

            <div class="shopping-cart">
                <div class="box">
                    <i class="fas fa-times"></i>
                    <img src="image/cart-1.jpg" alt=""/>
                        <div class="content">
                            <h3>organic food</h3>
                            <span class="quantity">1</span>
                            <span class="multiply">x</span>
                            <span class="price">$18.99</span>
                        </div>
                </div>
                <div class="box">
                    <i class="fas fa-times"></i>
                    <img src="image/cart-2.jpg" alt=""/>
                        <div class="content">
                            <h3>organic food</h3>
                            <span class="quantity">1</span>
                            <span class="multiply">x</span>
                            <span class="price">$18.99</span>
                        </div>
                </div>
                <div class="box">
                    <i class="fas fa-times"></i>
                    <img src="image/cart-3.jpg" alt=""/>
                        <div class="content">
                            <h3>organic food</h3>
                            <span class="quantity">1</span>
                            <span class="multiply">x</span>
                            <span class="price">$18.99</span>
                        </div>
                </div>
                <h3 class="total"> total : <span>56.97</span> </h3>
                <a href="#" class="btn">checkout cart</a>
            </div>

            <form action="" class="login-form">
                <h3>login form</h3>
                <input type="email" placeholder="enter your email" class="box"/>
                    <input type="password" placeholder="enter your password" class="box"/>
                        <div class="remember">
                            <input type="checkbox" name="" id="remember-me"/>
                                <label for="remember-me">remember me</label>
                        </div>
                    <input type="submit" value="login now" class="btn"/>
                        <p>forget password? <a href="#">click here</a></p>
                        <p>don't have an account? <a href="#">create one</a></p>
            </form>

        </header>
    );
}
                    export default Header;