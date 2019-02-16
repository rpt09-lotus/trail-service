import React from 'react';
import axios from 'axios';
import getTrailId from '../helpers/getId';
import style from '../css/bannerStyle.css';

export default class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTrail: getTrailId(),
      trail: null
    };
  }

  componentDidMount() {
    let endpoint = `http://ec2-52-11-10-220.us-west-2.compute.amazonaws.com/${this.state.activeTrail}/banner`
	  console.log('ENDPOINT', endpoint)
    this._asyncRequest = axios.get(endpoint)
      .then(response => {
        this._asyncRequest = null;
        this.setState({ trail: response.data });
      })
      .catch((error) => {
        console.error('axios banner error: ', error);
      });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.trail === null) {
      // Render loading state...
      return <div className="fetching"></div>;
    } else {
      return (
        <div id="banner_content" className={`${style.bannerContent} row flex-row justify-content-center align-items-end col-12`}>
          <div className={`${style.bannerImg} jumbotron-fluid d-flex`}>
            <img className="heroPhoto img-fluid" src={this.state.trail.heroUrl} alt="hero img" />
            <div className={style.heroStats}>
              <h2>{this.state.trail.trailName}</h2>
              <div className="difficulty">{this.state.trail.difficulty} <span className="reviews">⭐️⭐️⭐️ {this.state.trail.totalReviews} Reviews</span></div>
              <div className="rank">{this.state.trail.trailRank}</div>
              <div className="photoCount">{this.state.trail.photosCount} photos</div>
            </div>
          </div>
        </div>
      );
    }
  }
}
