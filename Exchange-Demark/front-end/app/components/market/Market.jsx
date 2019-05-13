import React, { PropTypes, Component } from 'react';

import { Table } from 'react-bootstrap';
import firebase from 'firebase';

import { Link } from 'react-router';

// import DateCountdown from 'react-date-countdown-timer';
//import all the component we need in our project
import CountDown from 'react-native-countdown-component';
//import CountDown to show the timer
import moment from 'moment';
//import moment to help you play with date and time

class Market extends Component {

    constructor(props) {
        super(props);

        this.readFromDtbsToTable = this.readFromDtbsToTable.bind(this);
        this.readIcoFromDtbs = this.readIcoFromDtbs.bind(this);

        this.state = {
            tokens: [],
            ico: [],
            totalDuration: '',
            days: 0,
            hours: 0,
            min: 0,
            sec: 0
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        // this.onCountDown = this.onCountDown.bind(this);
        
    }

    componentWillMount() {
        // Load custom in main and overrides
        require("../../css/main.less");
    }

    componentDidMount() {
        this.readFromDtbsToTable();
        this.readIcoFromDtbs();
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
        this.interval = setInterval(() => {
            const date = this.calculateCountdown(this.props.date);
            date ? this.setState(date) : this.stop();
          }, 1000);
          var that = this;
          var date = moment()
          .utcOffset('+05:30')
          .format('YYYY-MM-DD hh:mm');
          var expirydate = '2018-08-23 04:00:45';
          var diffr = moment.duration(moment(expirydate).diff(moment(date)));
          //difference of the expiry date-time given and current date-time
          var hours = parseInt(diffr.asHours());
          var minutes = parseInt(diffr.minutes());
          var seconds = parseInt(diffr.seconds());
          var d = hours * 60 * 60 + minutes * 60 + seconds;
          //converting in seconds
          that.setState({ totalDuration: d });
    }

    componentWillUnmount() {
        this.stop();
    }

    // letCountDown(expirydate) {
        
    //     //Settign up the duration of countdown in seconds to re-render
    // }

    calculateCountdown(endDate) {
        let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;
    
        // clear countdown when date is reached
        if (diff <= 0) return false;
    
        const timeLeft = {
          years: 0,
          days: 0,
          hours: 0,
          min: 0,
          sec: 0,
          millisec: 0
        };
    
        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
          timeLeft.years = Math.floor(diff / (365.25 * 86400));
          diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
          timeLeft.days = Math.floor(diff / 86400);
          diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
          timeLeft.hours = Math.floor(diff / 3600);
          diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
          timeLeft.min = Math.floor(diff / 60);
          diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;
    
        return timeLeft;
    }

    stop() {
        clearInterval(this.interval);
    }
    
    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
          value = '0' + value;
        }
        return value;
    }

    readFromDtbsToTable() {
        //var index = 1;
        var databaseRef = firebase.database().ref("/tokens");
        var tokenData = [];
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                if (item.approve == true) {
                    tokenData.push(item);
                    //index++;
                }
            });
        });

        this.setState({
            tokens: tokenData
        });
    }

    readIcoFromDtbs() {
        var index = 1;
        var databaseRef = firebase.database().ref("/contract_ico");
        var icoData = [];
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                if (item.approve == false) {
                    icoData.push(item);
                    index++;
                }
            });
        });

        this.setState({
            ico: icoData
        });
    }

    render() {
        console.log(this.state.totalDuration);
        return (
            <div>
                {/* List of Token ICO */}
                <div className="market-table panel panel-default">
                    <div className="container-fluid">
                        <div className="row panel-heading">
                            <h1 className="panel-title">LIST OF TOKEN</h1>
                            {/* {!this.props.market.error && ( */}
                            <hr />
                            <Table history id="tbl_tokens_list">
                                <thead>
                                    <tr>
                                        {/* <th>#</th> */}
                                        <th>Name</th>
                                        <th>Symbol</th>
                                        <th>Address</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.tokens.map(item => {
                                        return (
                                            <tr key={item.key} value={item}>
                                                <td className="style-row" hidden>
                                                    {item.key}
                                                </td>
                                                <td className="style-row color-token-name">
                                                    <Link to={`/tokendetail/${item.key}`}>
                                                    {/* <Link to={`/tokendetail/${item.key}`}> */}
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td className="style-row">{item.symbol}</td>
                                                <td className="style-row">{item.address}</td>
                                                <td className="style-row">{item.description}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            {/* )} */}
                        </div>
                    </div>
                </div>

                {/* List contract ICO */}
                <div className="market-table panel panel-default">
                    <div className="container-fluid">
                        <div className="row panel-heading">
                            <h1 className="panel-title">LIST ICO</h1>
                            {/* {!this.props.market.error && ( */}
                            <hr />
                            <Table history id="tbl_ico_list">
                                <thead>
                                    <tr>
                                        {/* <th>#</th> */}
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Deadline</th>
                                        {/* <th>Deadline</th> */}
                                        <th>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.ico.map(item => {
                                        return (
                                            <tr key={item.key} value={item}>
                                                {/* <td className="style-row">
                                                {item.key}
                                            </td> */}
                                                <td className="style-row color-token-name">
                                                    <Link to={`/contractico/${item.key}`}>
                                                        {item.icoName}
                                                    </Link>
                                                </td>
                                                <td className="style-row">
                                                    {item.preOrderAmount} <br></br>
                                                    {item.orderAmount}
                                                </td>
                                                <td className="style-row">
                                                    {item.endOrderTime}
                                                    <CountDown
                                                        until={this.state.totalDuration}
                                                        //duration of countdown in seconds
                                                        timetoShow={('H', 'M', 'S')}
                                                        //formate to show
                                                        onFinish={() => alert('ICO Done')}
                                                        //on Finish call
                                                        onPress={() => alert('ICO start')}
                                                        //on Press call
                                                        size={20}
                                                        />
                                                    {/* {this.onCountDown(item.endOrderTime)} */}
                                                </td>
                                                <td className="style-row">{item.addressOfTokenUsed}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            {/* )} */}
                        </div>
                    </div>
                </div>

                <div className="market-table panel panel-default">
                    <div className="container-fluid">
                        <div className="row panel-heading">
                            <h1 className="panel-title">Trends of ICO Blockchain</h1>
                            <hr />
                            <div className="col-sm-3">
                                <div className="card">
                                    <img clclassName="card-img-top" src="https://blog.blockchain.com/content/images/2019/04/xlmprimer_blog-2.png" style={{width: '150px'}} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">What is Stellar?</h5>
                                        <p className="card-text">A Primer on Our Wallet’s Newest Cryptoasset</p>
                                        <a href="https://blog.blockchain.com/2019/04/29/what-is-stellar-a-primer-on-our-wallets-newest-crypto-asset/" className="btn btn-primary">More</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="card">
                                    <img clclassName="card-img-top" src="https://blog.blockchain.com/content/images/2019/02/givingweek_blog-1.png" style={{width: '150px'}} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">Giving Crypto</h5>
                                        <p className="card-text">The Airdrop That Keeps On Giving</p>
                                        <a href="https://blog.blockchain.com/2019/02/26/givecrypto/" className="btn btn-primary">More</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="card">
                                    <img clclassName="card-img-top" src="https://fs.bitcoinmagazine.com/img/images/whatisETH.original.jpg" style={{width: '150px'}} alt="Card image cap"/>
                                    <div className="card-body">
                                        <h5 className="card-title">What Is Ether?</h5>
                                        <p className="card-text">Ether is the underlying token powering the Ethereum blockchain</p>
                                        <a href="https://www.coinschedule.com/blog/quantum-resistant-ilcoin-returns-to-bitker/" className="btn btn-primary">More</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="card">
                                    <img clclassName="card-img-top" src="https://fs.bitcoinmagazine.com/img/images/What_is_an_ICO.original.jpg" style={{width: '150px'}} alt="What Is an ICO?"/>
                                    <div className="card-body">
                                        <h5 className="card-title">What Is an ICO?</h5>
                                        <p className="card-text">An Initial Coin Offering, also commonly referred to as an ICO</p>
                                        <a href="https://blog.blockchain.com/2019/04/29/what-is-stellar-a-primer-on-our-wallets-newest-crypto-asset/" className="btn btn-primary">More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

Market.propTypes = {
    date: PropTypes.string.isRequired
  };
  
Market.defaultProps = {
    date: new Date()
};


module.exports = Market;