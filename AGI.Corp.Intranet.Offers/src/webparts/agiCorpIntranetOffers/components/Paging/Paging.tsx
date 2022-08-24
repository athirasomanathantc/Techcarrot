import * as React from "react";
import { IPagingProps } from "./IPagingProps";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import Pagination from "react-js-pagination";
import styles from './Paging.module.scss';
//require ('../../CSS/Styles.css');

export default class Paging extends React.Component<IPagingProps, null> {

  constructor(props: IPagingProps) {
    super(props);

    this._onPageUpdate = this._onPageUpdate.bind(this);
  }

  public render(): React.ReactElement<IPagingProps> {

    return (
      <div className={'site-pagination'}>

        <Pagination
          activePage={this.props.currentPage}
          firstPageText={<i className="fas fa-angle-double-left" aria-hidden="true"></i>}
          lastPageText={<i className="fas fa-angle-double-right" aria-hidden="true"></i>}
          prevPageText={<i className="fas fa-angle-left" aria-hidden="true"></i>}
          nextPageText={<i className="fas fa-angle-right" aria-hidden="true"></i>}
          itemClassFirst={'navButtonFirst'}
          itemClassPrev={'navButtonPrev'}
          itemClassNext={'navButtonNext'}
          itemClassLast={'navButtonLast'}
          activeLinkClass={`active`}
          itemsCountPerPage={this.props.itemsCountPerPage}
          totalItemsCount={this.props.totalItems}
          pageRangeDisplayed={5}
          onChange={this.props.onPageUpdate}
        />
        


      </div>
    );
  }

  private _onPageUpdate(pageNumber: number): void {
    this.props.onPageUpdate(pageNumber);
  }
}
