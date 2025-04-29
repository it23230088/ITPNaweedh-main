import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import PropTypes from 'prop-types';

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = 'LKR '
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // Getting Doctors using API
    const getDoctosData = useCallback(async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }, [backendUrl])

    // Getting User Profile using API
    const loadUserProfileData = useCallback(async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }, [backendUrl, token])

    useEffect(() => {
        getDoctosData()
    }, [getDoctosData])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token, loadUserProfileData])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}
AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default AppContextProvider