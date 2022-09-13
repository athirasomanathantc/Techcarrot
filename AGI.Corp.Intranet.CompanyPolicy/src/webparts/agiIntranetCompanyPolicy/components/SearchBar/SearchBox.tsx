import * as React from 'react';
import { useState } from 'react';

export const SearchBox = (props: any) => {
    const [searchField, setSearchField] = useState("");

    const filteredPolicies = props.policies.filter(
        (policy: any) => {
            return (
                policy
                    .Title
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) ||
                policy
                    .PolicyDescription
                    .toLowerCase()
                    .includes(searchField.toLowerCase())
            );
        }
    );

    const handleChange = (e: any) => {
        setSearchField(e.target.value);
        props.showFilteredPolicies(filteredPolicies);
    };

    return (
        <>
            <div className="search-wrapper mb-3">
                <form action="" className="search-bar d-md-flex ">
                    <div className="input-group">
                        <input type="text" className="form-control form-control-lg" placeholder="Search Here" onChange={handleChange} />
                        <button type="submit" className="input-group-text btn-serach">
                            <i className="bi bi-search">
                                <img src="../Assets/images/icon-search-dark.svg" alt="" />
                            </i>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}