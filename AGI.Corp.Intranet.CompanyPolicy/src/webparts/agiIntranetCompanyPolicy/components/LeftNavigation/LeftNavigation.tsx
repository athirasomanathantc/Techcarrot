import * as React from 'react';
import { useEffect, useState } from 'react';
import { sp } from "@pnp/sp/presets/all";
import { ILeftNavigation } from '../../models/ILeftNavigation';

interface IPolicyType {
    Title: string,
    URL:{
        Url:string
    }
}

export const LeftNavigation = (props: ILeftNavigation): JSX.Element => {
    const [error, setError] = useState(null);
    const [policyType, setPolicyType] = useState(props.policyType);
    const [policyTypes, setPolicyTypes] = useState([]);
    const type=props.policyType;
    console.log('selected type',props.policyType)
    
    
   
    const showPolicies = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, policyType: IPolicyType): void => {
        setPolicyType(policyType.Title)
        console.log('policy types',policyTypes);
        //props.showPolicies(e, policyType.Title)
    }

    useEffect(() => {
        const getPolicyTypes = async (): Promise<void> => {
            const policyTypes = await sp.web.lists.getByTitle('PolicyType').items
                .select("Id,Title,URL")
                .top(100)().then((items: [{ Id: number, Title: string }]) => {
                    return items
                })
                .catch((exception) => {
                    throw new Error(exception);
                });
            setPolicyTypes(policyTypes);
            
        }
        getPolicyTypes().catch((error) => {
            setError(error);
        })

        
    }, [])

    if (error) {
        throw error;
    }

    return (
        <>
            <div className="col-lg-3 mb-3 mb-md-0">
                <div className="sidebar-nav">
                    <div className="sidebar-menu dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="sidebarMenuDropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">{policyType}</button>
                        <ul className="nav nav-tabs dropdown-menu" id="policiesTab" role="tablist">
                            {policyTypes.map((policyType: IPolicyType, index: number) => {
                                const selectedType = policyType.Title.toLowerCase()==type.toLowerCase()?true:false;
                                
                                return (<>
                                    <li className="nav-item" role="presentation" onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => showPolicies(e, policyType)}>
                                        <a href={`${policyType.URL.Url}?env=WebView&page=Policies`} className={`nav-link ${selectedType?'active':''}`} id="general-tab">{policyType.Title}</a>
                                        {/* <button className={`nav-link ${selectedType?'active':''}`} id="general-tab" data-bs-toggle="tab" data-bs-target="#general-tab-content" type="button" role="tab" aria-controls="home" aria-selected="false">{policyType.Title}</button> */}
                                    </li>
                                </>)
                            })}
                            {
                                !policyTypes.length && <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="hr-tab" data-bs-toggle="tab" data-bs-target="#hr-tab-content" type="button" role="tab" aria-controls="profile" aria-selected="false">No  items found</button>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}