// root/app//component/navBar.js
'use client';
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Logo from "./logo"
import { useUserAuth } from "../utils/authContext";
import { useContextProvider } from "../utils/globalContext";
// import test from "../pages/mainPage";

export default function NavBar({currentPage}) {
    const [hamburgerShow, setHamburgerShow] = useState(false);
    const {user, firebaseSignOut} = useUserAuth();

    const [submenu, setSubmenu] = useState(null);
    const [submenuItems, setSubmenuItems] = useState([]);
    const [subList, setSubList] = useState([]);

    const [isTop, setIsTop] = useState(true);


    // Get the menuHeight and setMenuHeight from the global context
    const { menuHeight, setMenuHeight } = useContextProvider();
    const menuDiv = useRef(null);

    // Update the menuHeight when the window is resized
    useEffect(() => {
        updateDivHeights();
        window.addEventListener('resize', updateDivHeights);
    
        return () => {
          window.removeEventListener('resize', updateDivHeights);
        };
    }, []);   
    // Function to update the menuHeight
    const updateDivHeights = () => {
        if (menuDiv.current) {
            setMenuHeight(menuDiv.current.clientHeight);
        }
    };


    useEffect(() => {
        const handleScroll = () => {
          // Set isShrunk to true if page is scrolled more than 50px, else to false
          setIsTop(window.scrollY <= 100);
        };
      
        // Add scroll event listener when component mounts
        window.addEventListener('scroll', handleScroll);
      
        // Remove scroll event listener when component unmounts
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);



    const leftWing = [
        {name: "Home", link: "../pages/mainPage"},
        {name: "Plans", link: "../pages/planPage"},
        {name: "How it works", link: "../pages/infoPage"},
        {name: "About us", link: "../pages/aboutPage"}
    ];


    const rightWing = user ? 
    [
        {name: "Blogs", link: "../pages/blogPage"},
        {name: "Term of Services", link: "../pages/termOfServicePage"},
        {name: "Contact us", link: "../pages/contactPage"},
        {name: "Account ", link: "#", submenu: subList},
    ]
    :
    [
        {name: "Blogs", link: "../pages/blogPage"},
        {name: "Term of Services", link: "../pages/termOfServicePage"},
        {name: "Contact us", link: "../pages/contactPage"},
        {name: "Login", link: "../pages/loginPage"}
    ];

    useEffect(() => {
        if (user) {
            switch (user.role) {
                case "user":
                    setSubList(
                        [
                            {name: "Your Profile", link: "../pages/accountPage"},
                            {name: "Sign Out", link: firebaseSignOut}
                        ]
                    );
                    break;
                case "subscriber":
                    setSubList(
                        [
                            {name: "Your Profile", link: "../pages/accountPage"},
                            {name: "Appointment", link: "../pages/bookAppointment"},
                            {name: "Sign Out", link: firebaseSignOut}
                        ]
                    );
                    break;
                default:
                    setSubList(
                        [
                            {name: "Your Profile", link: "../pages/accountPage"},
                            {name: "Appointment", link: "../pages/bookAppointment"},
                            {name: "Manage Coach Images", link: "../pages/manageCoachPicture"},
                            {name: "Manage Plans", link: "../pages/managePlan"},
                            {name: "Manage Testimony", link: "../pages/manageTestimony"},
                            {name: "Manage NewsLetter", link: "../pages/manageNewsLetter"},
                            {name: "Manage Schedule", link: "../pages/manageSchedule"},
                            {name: "Manage Users", link: "../pages/manageUser"},
                            {name: "Manage Transaction", link: "../pages/manageTransaction"},
                            {name: "Sign Out", link: firebaseSignOut}
                        ]
                    );
                    break;
            }
        }
    }
    , [user]);


    //Hamburger menu animation
    const [hamburgerPhaseOne, setHamburgerPhaseOne] = useState(false);
    const [hamburgerPhaseTwo, setHamburgerPhaseTwo] = useState(false);

    const handleHamburger = () => {
        if (!hamburgerShow) {
            setHamburgerPhaseOne(true);
            setHamburgerShow(true);
            setTimeout(() => {
                setHamburgerPhaseTwo(true);

            }, 250);
        } else {
            setHamburgerPhaseTwo(false);
            setTimeout(() => {
                setHamburgerShow(false);
                setHamburgerPhaseOne(false);
                setSubmenu(null);
            }, 250);
        }
    }

    const [highLightPage, setHighLightPage] = useState();

    useEffect(() => {
        setHighLightPage(currentPage);
    }, [currentPage]);


    //submenu logic

    const [showSubmenu, setShowSubmenu] = useState(false);
    const [showSubmenuTwo, setShowSubmenuTwo] = useState(false);

    const handleSubMenu = (name) => {
        if (!submenu) {
            setSubmenu(name);
        } else {
            setSubmenu(null);
            setShowSubmenuTwo(false);
            setTimeout(() => {
                setShowSubmenu(false);
            }, 400);
        }
    }


    useEffect(() => {
        if (submenu) {
            // Combine both leftWing and rightWing arrays
            const combinedMenu = [...leftWing, ...rightWing];
    
            // Find the item that matches the submenu
            const foundItem = combinedMenu.find(item => item.name === submenu);
    
            // Check if the found item has a submenu property
            if (foundItem && foundItem.submenu) {
                setSubmenuItems(foundItem.submenu);
                setShowSubmenu(true);
                setTimeout(() => {
                    setShowSubmenuTwo(true);
                },250);
            
            } else {
                // If no submenu is found, or the found item doesn't have a submenu
                setSubmenuItems([]);
                setShowSubmenuTwo(false);
                setTimeout(() => {
                setShowSubmenu(false);
            }, 250);
            }
        } else {
            // If no submenu is selected
            setSubmenuItems([]);
            setShowSubmenuTwo(false);
            setTimeout(() => {
                setShowSubmenu(false);
            }, 250);
        }
        
    }, [submenu,user]);

    return (
        <div className={`smooth-component-300 flex justify-center items-center bg-item-day w-full text-three-day text-center text-sm ${isTop ? '' : ''}`}
        ref={menuDiv}>
            
            {/* large screen ------------------------------------------------------------- */}
            <div className="hidden lg:flex lg:flex-row space-x-4 items-center justify-center relative"
            style={showSubmenu ? {zIndex : 2} : {}}>
                {/* Home, PLans, How it works, About us */}
                <ul className="flex space-x-8">
                    {leftWing.map((item, index) => (
                        <li key={index}
                        onClick={() => item.submenu && handleSubMenu (item.name)}>
                            {item.submenu ? (
                                <div className="hover:text-green-500 smooth-component hover:cursor-pointer">{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9660;</div>}</div>
                            ) : (
                                <Link href={item.link} className={`hover:text-green-500 smooth-component ${item.name===highLightPage? 'animate-pulse' : ''}`}>{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9660;</div>}</Link>
                            )}                        
                        </li>
                    ))}
                </ul>
                {/* Logo of the NavBar */}
                <div className={`logo-size smooth-component-300 w-2/12 ${isTop ? 'big-logo' : 'small-logo'}`}>
                    <Logo/>
                </div>
                {/* Blogs, Term of Services, Contact us, Sign up/Login */}
                <ul className="flex space-x-8">
                    {rightWing.map((item, index) => (
                        <li key={index}
                        onClick={() => item.submenu && handleSubMenu (item.name)}>
                            {item.submenu ? (
                                <div className="hover:text-green-500 smooth-component hover:cursor-pointer">{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9660;</div>}</div>
                            ) : (
                                <Link href={item.link} className={`hover:text-green-500 smooth-component ${item.name===highLightPage? 'animate-pulse' : ''}`}>{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9660;</div>}</Link>
                            )}                        
                            </li>
                    ))}
                </ul>
                {/* Submenu-------------------------------------------------------------------------------------- */}
                <div className={`w-screen absolute top-0 bg-item-day smooth-component-300 justify-center items-center bg-item-day text-three-day text-center py-6 hidden ${showSubmenu? 'lg:flex lg:flex-row opacity-0' : ''} ${showSubmenuTwo? 'lg:top-14 opacity-100' : ''}`}
                style={{zIndex: -1}}>
                    <ul className={`flex justify-evenly w-full`}>
                        {submenuItems.map((item, index) => (
                            <li key={index}
                            className="py-4">
                                {item.name === "Sign Out" ?
                                    <button onClick={item.link} className="hover:text-green-500 smooth-component">{item.name}</button>
                                    :
                                    <Link href={item.link} className="hover:text-green-500 smooth-component">{item.name}</Link>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* small screen ----------------------------------------------------------------*/}
            <div className="lg:hidden flex justify-end w-full relative items-center py-4 px-6">
                <div className="absolute -top-2 left-6 max-w-40 lg:hidden">
                    <Logo />
                </div>
                {user && <div className="text-base mr-6">{user.name}</div>}
                <div className=" w-10 h-10 overflow-hidden relative smooth-component hover:cursor-pointer"
                onClick={handleHamburger}>
                    <div className={`absolute top-0 left-0 flex flex-col smooth-component ${hamburgerShow ? '' : ''}`}>
                        {/* <svg className="" width="40px" height="40px" viewBox="0 0 24 24" fill="none" stroke="#fefff3" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7L4 7"  stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M20 12L4 12"  stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M20 17L4 17"  stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <svg className="p-1" width="40px" height="40px" viewBox="0 0 24 24" fill="none" stroke="#fefff3" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#fefff3" strokeWidth="0"/>
                        </svg> */}
                        <div className={`hamburger-line ${hamburgerPhaseOne? 'hamburger-line-1-phase-1' :''} ${hamburgerPhaseTwo? 'hamburger-line-1-phase-2' : ''}`}></div>
                        <div className={`hamburger-line ${hamburgerPhaseOne? 'hamburger-line-2-phase-1' :''}`}></div>
                        <div className={`hamburger-line ${hamburgerPhaseOne? 'hamburger-line-3-phase-1' :''} ${hamburgerPhaseTwo? 'hamburger-line-3-phase-2' : ''}`}></div>
                    </div>
                </div>
                <div className={`relative bg-item-day p-10 w-screen text-left smooth-component-300 menu-hide ${hamburgerShow? '' :'hidden'} ${hamburgerPhaseTwo? 'menu-show' :''}`}>
                    <ul className={`flex flex-col space-y-4`}>
                        {leftWing.map((item, index) => (
                            <li key={index} className="py-1"
                            onClick={() => item.submenu && handleSubMenu (item.name)}>
                                {item.submenu ? (
                                    <div className="hover:text-green-500 smooth-component hover:cursor-pointer">{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9664;</div>}</div>
                                ) : (
                                    <Link href={item.link} className={`hover:text-green-500 smooth-component ${item.name===highLightPage? 'animate-pulse' : ''}`}>{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9664;</div>}</Link>
                                )}
                            </li>
                        ))}
                        {rightWing.map((item, index) => (
                            <li key={index} className="py-1"
                            onClick={() => item.submenu && handleSubMenu (item.name)}>
                                {item.submenu ? (
                                    <div className="hover:text-green-500 smooth-component hover:cursor-pointer">{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9664;</div>}</div>
                                ) : (
                                    <Link href={item.link} className={`hover:text-green-500 smooth-component ${item.name===highLightPage? 'animate-pulse' : ''}`}>{item.name} {item.submenu && <div className={`arrow-icon  inline-block smooth-component-300 ${showSubmenu ? ' rotate-180' : ''}`}>&#9664;</div>}</Link>
                                )}
                            </li>
                        ))}
                    </ul>
                    {/* Submenu-------------------------------------------------------------------------------------- */}
                    <div className={`w-1/2 h-full absolute top-0 bg-item-day smooth-component-300 justify-center items-end bg-item-day text-three-day text-right lg:hidden border-l-2 border-white ${showSubmenu? 'flex flex-col opacity-0' : 'hidden'} ${showSubmenuTwo? 'right-0 opacity-100' : '-right-1/2'}`}
                    style={{zIndex:1}}>
                        <ul className={`flex flex-col`}>
                            {submenuItems.map((item, index) => (
                                <li key={index}
                                className="py-2 px-10">
                                    {item.name === "Sign Out" ?
                                        <button onClick={item.link} className="hover:text-green-500 smooth-component">{item.name}</button>
                                        :
                                        <Link href={item.link} className="hover:text-green-500 smooth-component">{item.name}</Link>
                                    }
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}