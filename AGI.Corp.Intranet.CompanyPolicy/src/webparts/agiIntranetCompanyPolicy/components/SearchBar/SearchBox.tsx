import * as React from 'react';
import { IPolicy } from '../../models/IPolicy';

export const SearchBox = (props: { showFilteredPolicies: (arg0: IPolicy[]) => void, policies: IPolicy[] }): JSX.Element => {
    const getFilteredPolicies = (keyword: string): IPolicy[] => props.policies.filter(
        (policy: IPolicy) => {
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

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.FormEvent<HTMLInputElement>) => {
        props.showFilteredPolicies(getFilteredPolicies((e.target as HTMLInputElement).value));
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