import React, { useEffect, useState, useRef } from "react";
import "./ProfileModal.css";
import { Modal, useMantineTheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { Form, useParams } from "react-router-dom";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import swal from "sweetalert";
import { Country, State, City } from "country-state-city";

import * as UserAPI from "../../api/UserRequest";

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
    const theme = useMantineTheme();
    const { password, ...other } = data;
    const [formData, setFormData] = useState(other);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const imageRef = useRef();
    const [nameImg1, setNameImg] = useState("");

    // const [cityOfcountry, setCityOfcountry] = useState(
    //     City.getCitiesOfCountry("VN")
    // );
    const [country, setCountry] = useState(Country.getAllCountries());
    const dispatch = useDispatch();
    const { id } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("profile"));

    let gender_ = ["Male", "Female", "Other"];
    let relationship_ = [
        "Married",
        "Single",
        "Engaged",
        "In a relationship",
        "Divorced",
        "Separated",
    ];
    let Job_ = [
        "Doctor",
        "IT",
        "Single",
        "Actor",
        "Student",
        "Teacher",
        "Photographer",
        "Editor",
        "Driver",
        "Chef",
    ];
    useEffect(() => {
        setFormData(currentUser.data);
    }, [id]);

    const handleChange = (e) => {
        // if (e.target.name === "country") {

        //     // setCityOfcountry(State.getStatesOfCountry(e.target.value));
        //     setFormData({
        //         ...formData,
        //         [e.target.name]: Country.getCountryByCode(e.target.value).name,
        //     });
        // } else {

        // }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // console.log("đc ko");
    const onImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNameImg(e.target.files[0].name);
            let img = e.target.files[0];
            e.target.name = "profilePicture"
                ? setProfileImage(img)
                : setCoverImage(img);
        }
    };
    const setUserAccount = (nameImg = null) => {
        let data = {
            avatar: nameImg,
            country: formData.country,
            email: currentUser.data.email,
            firstName: formData.firstName,
            gender: formData.gender,
            isActive: currentUser.data.isActive,
            lastName: formData.lastName,
            livesin: formData.livesin,
            relationship: formData.relationship,
            workAt: formData.workAt,
            _id: currentUser.data._id,
        };
        localStorage.setItem(
            "profile",
            JSON.stringify({ data: data, token: currentUser.token })
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("email", formData.email);
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("gender", formData.gender);
        data.append("livesin", formData.livesin);
        data.append("country", formData.country);
        data.append("workAt", formData.workAt);
        data.append("relationship", formData.relationship);
        data.append("user_token", currentUser.token);
        data.append("user_avatar", profileImage);

        if (profileImage !== null) {
            let result = await UserAPI.updateUser(data);
            if (result.data) {
                setUserAccount(result.data);
                swal({
                    title: "update success",
                    icon: "success",
                    button: "OK!",
                });
                setModalOpened(false);
            } else {
                swal({
                    title: "update fail",
                    icon: "error",
                    button: "OK!",
                });
            }
        } else {
            swal({
                title: "Are you sure to update without selecting photos ?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (btnAction) => {
                if (!btnAction) {
                } else {
                    let result = await UserAPI.updateUser(data);
                    if (result.data) {
                        setUserAccount(result.data);
                        swal({
                            title: "update success",
                            icon: "success",
                            button: "OK!",
                        });
                        setModalOpened(false);
                    } else {
                        swal({
                            title: "update fail",
                            icon: "error",
                            button: "OK!",
                        });
                    }
                }
            });
        }
    };
    return (
        <Modal
            overlayColor={
                theme.colorScheme === "dark"
                    ? theme.colors.dark[9]
                    : theme.colors.gray[2]
            }
            overlayOpacity={0.55}
            overlayBlur={3}
            size="55%"
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
        >
            {/* Modal content */}
            <form className="infoForm" action="">
                <h3>Your infor</h3>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        name="email"
                        placeholder="Email"
                        disabled
                        value={formData.email}
                    />

                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.gender}
                        label="Gender"
                        name="gender"
                        onChange={handleChange}
                        style={{ width: "332px", height: "40px" }}
                    >
                        {gender_.map((value1, index) => (
                            <MenuItem value={value1} key={index}>
                                {value1}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* <input
            type="text"
            className="infoInput"
            name="gender"
            placeholder="Type your gender"
            onChange={handleChange}
            value={formData.gender}
          /> */}
                </div>

                <div>
                    <input
                        type="text"
                        className="infoInput"
                        name="firstName"
                        placeholder="First Name"
                        onChange={handleChange}
                        value={formData.firstName}
                        style={{
                            border: "1px solid #c4c4c4",
                            backgroundColor: "white",
                        }}
                    />
                    <input
                        type="text"
                        className="infoInput"
                        name="lastName"
                        placeholder="Last Name"
                        onChange={handleChange}
                        value={formData.lastName}
                        style={{
                            border: "1px solid #c4c4c4",
                            backgroundColor: "white",
                        }}
                    />
                </div>
                <div>
                    {/* <input
                        type="text"
                        className="infoInput"
                        name="country"
                        placeholder="Country"
                        onChange={handleChange}
                        value={formData.country}
                    /> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.country}
                        label="country"
                        name="country"
                        onChange={handleChange}
                        style={{ width: "332px", height: "40px" }}
                    >
                        {country.map((value1, index) => (
                            <MenuItem value={value1.name} key={index}>
                                {value1.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <input
                        type="text"
                        className="infoInput"
                        name="livesin"
                        placeholder="Lives In"
                        onChange={handleChange}
                        value={formData.livesin}
                        style={{
                            border: "1px solid #c4c4c4",
                            backgroundColor: "white",
                        }}
                    />

                    {/* <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.livesin}
                        label="livesin"
                        name="livesin"
                        onChange={handleChange}
                        style={{ width: "332px", height: "40px" }}
                    >
                        {cityOfcountry.map((value1, index) => (
                            <MenuItem value={value1.name} key={index}>
                                {value1.name}
                            </MenuItem>
                        ))}
                    </Select> */}
                </div>
                <div>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.workAt}
                        label="Relationship"
                        name="workAt"
                        onChange={handleChange}
                        style={{ width: "332px", height: "40px" }}
                    >
                        {Job_.map((value1, index) => (
                            <MenuItem value={value1} key={index}>
                                {value1}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* <input
            type="text"
            className="infoInput"
            name="workAt"
            placeholder="Job"
            onChange={handleChange}
            value={formData.workAt}
          /> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.relationship}
                        label="Relationship"
                        name="relationship"
                        onChange={handleChange}
                        style={{ width: "332px", height: "40px" }}
                    >
                        {relationship_.map((value1, index) => (
                            <MenuItem value={value1} key={index}>
                                {value1}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* <input type="text"
                        className='infoInput'
                        name='relationship'
                        placeholder='Relationship Status'
                        onChange={handleChange}
                        value={formData.relationship}
                    /> */}
                </div>
                <div style={{ alignItems: "center" }}>
                    Profile Image
                    <input
                        style={{ display: "none" }}
                        type="file"
                        name="profilePicture"
                        ref={imageRef}
                        onChange={onImageChange}
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            imageRef.current.click();
                        }}
                    >
                        Change Avatar
                    </button>
                    <span style={{ fontSize: "14px" }}>{nameImg1}</span>
                    {/* Cover Image
                    <input
                        type="file"
                        name="coverPicture"
                        onChange={onImageChange}
                    /> */}
                </div>
                <button className="button infoButton" onClick={handleSubmit}>
                    Update
                </button>
            </form>
        </Modal>
    );
};

export default ProfileModal;
