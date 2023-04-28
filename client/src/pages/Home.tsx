import React from 'react';
import {HomeSlider} from "../components/home/HomeSlider/HomeSlider";
import {CategoryAndTopSaveToday} from "../components/home/CategoryAndTopSaveToday/CategoryAndTopSaveToday";
import '../components/home/HomeStyles.scss'

export const Home = () => {
  return <div className={'home-container'}>
    <HomeSlider/>
    <CategoryAndTopSaveToday/>

  </div>
}

