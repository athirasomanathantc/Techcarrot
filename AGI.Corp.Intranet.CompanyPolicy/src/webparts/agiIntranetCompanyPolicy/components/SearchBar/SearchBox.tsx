import * as React from 'react';
import { useState } from 'react';

export const SearchBox = (props: any) => {
    const getFilteredPolicies = (keyword: string) => props.policies.filter(
        (policy: any) => {
            return (
                policy
                    .Title
                    .toLowerCase()
                    .includes(keyword.toLowerCase()) ||
                policy
                    .PolicyDescription
                    .toLowerCase()
                    .includes(keyword.toLowerCase())
            );
        }
    );

    const handleChange = (e: any) => {
        props.showFilteredPolicies(getFilteredPolicies(e.target.value));
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