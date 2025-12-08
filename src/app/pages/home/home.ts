import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Partners } from '../../components/partners/partners';
import { TradableAssets } from '../../components/tradable-assets/tradable-assets';
import { Stats } from '../../components/stats/stats';
import { AccountTypes } from '../../components/account-types/account-types';
import { Contact } from '../../components/contact/contact';
import { Performance } from '../../components/performance/performance';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Partners, TradableAssets, Stats, Performance, AccountTypes, Contact],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {}
