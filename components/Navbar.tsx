import Link from "next/link";
import { useSelector } from "react-redux";
import { CurrentAuthState } from "../slices/authSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { authSignOut } from "../api/auth";
import { signOut } from "next-auth/react";
import type { NavItems, NavItemsList } from "../type/navbar";

export default function Navbar() {
    const { data: session } = useSession()
    const { token } = useSelector(CurrentAuthState);
    const router = useRouter()
    const [navItems, setNavItems] = useState<NavItemsList>([])
    const [umOpen, setUmOpen] = useState<boolean>(false)
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)

    if (navItems.length === 0) {
        fetch('/data/navitems.json', {
            cache: "force-cache"
        })
            .then(res => res.json())
            .then(data => {
                setNavItems(data)
            })
            .catch(err => console.log(err))
    }

    return (
        <nav className="dark:bg-teal-900 bg-teal-600 absolute w-full mt-0">
            <div className="mx-auto w-full px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* <!-- Mobile menu button--> */}
                        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-teal-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            {/* <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          --> */}
                            {!mobileOpen && <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>}
                            {/* <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          --> */}
                            {mobileOpen && <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>}
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=200" alt="Your Company" />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                                {navItems.map((item: NavItems, i: number) => (
                                    <Link key={i} href={item.disabled ? '' : item.path} legacyBehavior>
                                        <a className={`${item.path === router.pathname ? `bg-teal-900 text-white` : `text-teal-300 hover:bg-teal-700 hover:text-white`} rounded-md px-3 py-2 text-sm font-medium`}>{item.title}</a>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                        {/* <!-- Profile dropdown --> */}
                        <div className="relative ml-3">
                            <div>
                                {session || token ? <button type="button" onClick={() => setUmOpen(!umOpen)} className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                </button> : <Link
                                    href={'/login'}
                                    className="bg-teal-600 text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                }
                            </div>
                            {umOpen &&
                                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-95 transition ease-out duration-100" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-0">Your Profile</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">Settings</a>
                                <a onClick={() => session ? signOut() : authSignOut()
                                } className="block cursor-pointer px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-2">Sign out</a>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Mobile menu, show/hide based on menu state. --> */}
            {mobileOpen &&
                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navItems.map((item: NavItems, i: number) => (
                            <Link key={i} href={item.path} className={`text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium`}>{item.title}</Link>
                        ))}
                    </div>
                </div>
            }
        </nav>

    )
}