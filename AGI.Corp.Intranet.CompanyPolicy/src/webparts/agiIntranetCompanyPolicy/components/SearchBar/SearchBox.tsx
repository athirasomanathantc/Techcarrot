import * as React from 'react';
import { IPolicy } from '../../models/IPolicy';
import { ISearchBox } from '../../models/ISearchBox';

export const SearchBox = (props: ISearchBox): JSX.Element => {

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e: React.FormEvent<HTMLInputElement>) => {
        props.setKeyword((e.target as HTMLInputElement).value);
    };

    return (
        <>
            <div className="search-wrapper mb-3">
                <form action="" className="search-bar d-md-flex ">
                    <div className="input-group">
                        <input type="text" className="form-control form-control-lg" placeholder="Search Here" onChange={handleChange} value={props.keyword} />
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