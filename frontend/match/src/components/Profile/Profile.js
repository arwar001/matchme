import React, {useEffect, useState, useContext, useRef, useCallback} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import {AuthContext} from "../Context/AuthProvider";
import styles from './Profile.module.css'
import UserSelections from "../ReusableComponents/UserSelections";

const baseUrl = process.env.REACT_APP_API_BASE_URL;


function Profile() {
    const navigate = useNavigate();
    const {user: clientUser} = useContext(AuthContext);
    const id = useParams().id;
    const isOwner = clientUser.id === id;
    const clientId = useRef(clientUser.id);

    const defaultUser = useRef({
        id: id,
        name: '',
        surname: '',
        purpose: '',
        age: '',
        gender: '',
        country: '',
        city: '',
        education: '',
        profession: '',
        extraInfo: '',
        avatar: '',
        friend: false,
        clientSentRequestToUser: false,
        userSentRequestToClient: false
    })
    const [user, setUser] = useState(defaultUser.current);
    const requiredFields = ['name', 'surname', 'purpose', 'age', 'gender', 'city', 'country'];
    const [error, setError] = useState(false);
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${baseUrl}user/${id}/status`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Something went wrong');
                }

                const data = await response.json();
                console.log(data);
                setUser((prevUser) => ({...prevUser, ...data}));
            } catch (error) {
                console.error('Error while fetching user:', error);
                setUser(defaultUser.current);
            }

        }
        if (!isOwner) {
            void fetchUser();
        } else {
            setUser(clientUser);
        }

    }, [id, isOwner, clientUser]);

    useEffect(() => {
        const handleUploadPhoto = async () => {
            if (!file) {
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`${baseUrl}user/${clientId.current}/upload-photo`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    headers: {}
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Something went wrong');
                }
                const data = await response.json();
                setUser(prevUser => ({...prevUser, avatar: data.photoUrl}));
                alert('Photo uploaded successfully');
            } catch (error) {
                console.error('Error while uploading a photo: ', error);
            }
        };
        void handleUploadPhoto();
    }, [file]);


    const handleChange = useCallback((event) => {
        const {name, value} = event.target;
        setUser(prevUser => ({...prevUser, [name]: value}));
    }, [setUser]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file && file.size > 1 * 1024 * 1024) {
            alert('File size should not exceed 1MB');
            return;
        }

        setFile(file);
    }

    const isValid = requiredFields.every(field => user[field] !== null && user[field] !== "");

    const handleSave = async () => {
        if (!isValid) {
            alert('Please fill in all required fields');
            setError(true)
            return
        }
        try {
            const response = await fetch(`${baseUrl}user/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Something went wrong');
            }
            setIsEditing(false);
            setError(false);
        } catch (error) {
            console.error('Error while updating user: ', error);
        }
    }

    const handleRequest = async (e) => {
        try {
            const response = await fetch(`${baseUrl}friend`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "text/plain"
                },
                body: user.email
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Something went wrong');
            }
            if (e.target.id === 'accept') {
                setUser(prevUser => ({...prevUser, friend: true}));
            } else if (e.target.id === 'send') {
                setUser(prevUser => ({...prevUser, clientSentRequestToUser: true}));
            }


        } catch (e) {
            console.error(e);
        }

    }

    const handleDeleteRequest = async () => {
        try {
            const response = await fetch(`${baseUrl}friend/request/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Something went wrong');
            }

            setUser(prevUser => ({...prevUser, clientSentRequestToUser: false, userSentRequestToClient: false}));

        } catch (error) {
            console.error('Error canceling the request:', error);
        }
    };

    const handleRemoveFriend = async () => {
        try {
            const response = await fetch(`${baseUrl}friend/remove/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Something went wrong');
            }

            setUser(prevUser => ({...prevUser, friend: false}));

        } catch (error) {
            console.error('Error deleting a friend:', error);
        }
    }

    const getButton = () => {
        if (isOwner && isEditing) {
            return <button onClick={handleSave} className={styles.button}>Save</button>
        } else if (isOwner) {
            return <button onClick={() => setIsEditing(true)} className={styles.button}>Edit</button>
        } else if (user.friend) {
            return (
                <>
                    <button className={styles.button} onClick={() => {
                        navigate(`/chat/${user.id}`)
                    }}>Chat
                    </button>
                    <button className={styles.button} onClick={handleRemoveFriend}>Delete Friend</button>
                </>
            )
        } else if (user.userSentRequestToClient) {
            return (
                <>
                    <button className={styles.button} onClick={handleRequest} id='accept'>Accept Request</button>
                    <button className={styles.button} onClick={handleDeleteRequest}>Decline Request</button>
                </>
            )
        } else if (user.clientSentRequestToUser) {
            return <button className={styles.button} onClick={handleDeleteRequest}>Cancel Request</button>
        } else {
            return <button className={styles.button} onClick={handleRequest} id='send'>Send Request</button>
        }
    }

    if (isOwner && isEditing) {
        return (
            <div className={styles.profileMain}>
                <div className={styles.photoInfoContainer}>
                    <div className={styles.photoContainer}>
                        <img src={baseUrl + user.avatar + '?t=' + Date.now()} alt="Profile"
                             className={styles.photo} onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/icons/default_pfp.jpg"
                        }}/>
                        <div className={styles.editPfp}>Click to upload profile picture</div>
                        <input type="file" onChange={handleFileChange} id="file-input" className={styles.fileInput}/>
                    </div>

                    <div className={styles.profileInfo}>
                        <div className={styles.profileContent}>
                            <div className={styles.labels}>
                                <p>Name:</p>
                                <p>Surname:</p>
                                <p>Purpose:</p>
                                <p>Age:</p>
                                <p>Gender:</p>
                                <p>Country:</p>
                                <p>City:</p>
                                <p>Education:</p>
                                <p>Profession:</p>
                            </div>
                            <div className={styles.inputs}>
                                <input className={error ? styles.redInput : ""} name="name" value={user.name} onChange={handleChange} placeholder="Name"/>
                                <input className={error ? styles.redInput : ""} name="surname" value={user.surname} onChange={handleChange} placeholder="Surname"/>
                                <input className={error ? styles.redInput : ""} name="age" value={user.age} onChange={handleChange} placeholder="Age"/>
                                <UserSelections type="gender"
                                                handleChange={handleChange}
                                                defaultValue={user.gender}
                                                className={error ? styles.redInput : ""}
                                />

                                <UserSelections type="country"
                                                handleChange={handleChange}
                                                defaultValue={user.country}
                                                className={error ? styles.redInput : ""}
                                />

                                <UserSelections type="city"
                                                handleChange={handleChange}
                                                country={user.country}
                                                defaultValue={user.city}
                                                className={error ? styles.redInput : ""}
                                />

                                <UserSelections type="purpose"
                                                handleChange={handleChange}
                                                defaultValue={user.purpose}
                                                className={error ? styles.redInput : ""}
                                />
                                <input name="education" value={user.education} onChange={handleChange}
                                       placeholder="Education"/>
                                <input name="profession" value={user.profession} onChange={handleChange}
                                       placeholder="Profession"/>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={styles.descriptionContainer}>
                    <h2>Description</h2>
                    <div className={styles.textareaWrapper}>
                        <textarea name="extraInfo" value={user.extraInfo} onChange={handleChange}
                                  placeholder="Extra Info"/>
                        <div className={styles.buttonContainer}>
                            {getButton()}
                        </div>
                    </div>
                </div>
            </div>)
    }
    return (
        <div className={styles.profileMain}>
            <div className={styles.photoInfoContainer}>
                <div className={styles.photoContainer}>
                    <img src={baseUrl + user.avatar} alt="Profile"
                         className={styles.photo} onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/icons/default_pfp.jpg"
                    }}/>
                </div>

                <div className={styles.profileInfo}>
                    <h2>{user.name + " " + user.surname}</h2>
                    <div className={styles.profileContent}>
                        <div className={styles.labels}>
                            <p>Purpose:</p>
                            <p>Age:</p>
                            <p>Gender:</p>
                            <p>Country:</p>
                            <p>City:</p>
                            <p>Education:</p>
                            <p>Profession:</p>
                        </div>
                        <div className={styles.inputs}>
                            <p>{user.purpose}</p>
                            <p>{user.age}</p>
                            <p>{user.gender}</p>
                            <p>{user.country}</p>
                            <p>{user.city}</p>
                            <p>{user.education || 'empty'}</p>
                            <p>{user.profession || 'empty'}</p>
                        </div>
                    </div>
                </div>


            </div>

            <div className={styles.descriptionContainer}>
                <h2>Description</h2>
                <div className={styles.textareaWrapper}>
                    <p>{user.extraInfo || 'empty'}</p>

                    <div className={styles.buttonContainer}>
                        {getButton()}
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Profile;