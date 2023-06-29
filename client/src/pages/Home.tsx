import React from 'react';
import {HomeSlider} from "../components/home/HomeSlider/HomeSlider";
import {CategoryAndTopSaveToday} from "../components/home/CategoryAndTopSaveToday/CategoryAndTopSaveToday";
import '../components/home/HomeStyles.scss'
import {DailyBestSellers} from "../components/home/DailyBestSellers/DailyBestSellers";

export const Home = () => {
  return <div className={'home-container'}>
    <HomeSlider/>
    <CategoryAndTopSaveToday/>
    <DailyBestSellers/>
  </div>
}

