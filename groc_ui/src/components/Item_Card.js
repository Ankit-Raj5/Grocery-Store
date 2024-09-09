import React, { Component } from 'react'

export class Item_card extends Component {


  render() {
    let {name, description, img_url, price, rating, onclick} = this.props;
    return (
      <div className='my-3'>
        <div className="card" style={{width: "18rem"}}>
          <img src={img_url} className="card-img-top" alt="..."/>
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <div className="container d-flex justify-content-between">
              <h5>₹{price}</h5>
              <div className="card" bgcolor="lightgreen">{rating}★</div>
            </div>
            
            <p className="card-text">{description}</p>
            <button onClick={onclick}>Buy Now</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Item_card