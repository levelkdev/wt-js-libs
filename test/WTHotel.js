'use strict';

var chai = require('chai');
var assert = chai.assert;

var WTHotelLib;
if (process.argv.indexOf('test-build') > 0){
  console.log('Testing build..');
  WTHotelLib = require('../dist/node/WTHotel.js');
} else {
  WTHotelLib = require('../libs/WTHotel.js');
}

var wtHotelLib = new WTHotelLib({ wallet: {web3Provider: 'http://localhost:8545'}});

var web3 = wtHotelLib.web3;

const DEBUG = true;

describe('WT Hotel Lib', function() {
  this.timeout(120000);
  let indexAddress = "0x0";

  beforeEach(function() {
    let data = web3.eth.contract(wtHotelLib.contracts.WTIndex.abi).new.getData({data: wtHotelLib.contracts.WTIndex.unlinked_binary});
    var estimatedGas = web3.eth.estimateGas({data: data})+1000;
    return new Promise(function(resolve, reject){
      web3.eth.contract(wtHotelLib.contracts.WTIndex.abi).new({data: data, gas: estimatedGas, from: web3.eth.accounts[0]}, function(err, indexContract){
        if (indexContract.address){
          indexAddress = indexContract.address;
          resolve();
        }
      });
    });
  });

  it('Should create a wallet and fund it.', async function() {
    await wtHotelLib.wallet.createWallet('password123');
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: wtHotelLib.wallet.address, value: web3.toWei(5, 'ether')});
    assert.equal(web3.eth.getBalance(wtHotelLib.wallet.address), web3.toWei(5, 'ether'));
  });

  it('Should create a hotel, edit his info, address and ubication.', async function() {
    await wtHotelLib.wallet.createWallet('password123');
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: wtHotelLib.wallet.address, value: web3.toWei(5, 'ether')});
    assert.equal(web3.eth.getBalance(wtHotelLib.wallet.address), web3.toWei(5, 'ether'));
    wtHotelLib.setIndex(indexAddress);
    await wtHotelLib.createHotel('password123', 'WTHotel', 'Winding Tree Hotel');
    await wtHotelLib.updateHotels();
    let hotel = wtHotelLib.getHotel(wtHotelLib.hotelsAddrs[0]);
    assert.equal(hotel.name, 'WTHotel');
    assert.equal(hotel.description, 'Winding Tree Hotel');
    await wtHotelLib.changeHotelInfo('password123', wtHotelLib.hotelsAddrs[0], 'Awesome WTHotel', 'Awesome Winding Tree Hotel');
    await wtHotelLib.changeHotelAddress('password123', wtHotelLib.hotelsAddrs[0], 'Address one', 'Address two', '666', 'Spain');
    await wtHotelLib.changeHotelLocation('password123', wtHotelLib.hotelsAddrs[0], 1, wtHotelLib.utils.parseLongitude(15), wtHotelLib.utils.parseLatitude(50));
    await wtHotelLib.updateHotels();
    hotel = wtHotelLib.getHotel(wtHotelLib.hotelsAddrs[0]);
    assert.equal(hotel.name, 'Awesome WTHotel');
    assert.equal(hotel.description, 'Awesome Winding Tree Hotel');
    assert.equal(hotel.lineOne, 'Address one');
    assert.equal(hotel.lineTwo, 'Address two');
    assert.equal(hotel.zip, '666');
    assert.equal(hotel.country, 'Spain');
    assert.equal(hotel.timezone, '1');
    assert.equal(wtHotelLib.utils.formatLongitude(hotel.longitude), 15);
    assert.equal(wtHotelLib.utils.formatLatitude(hotel.latitude), 50);
  });

  it('Should create a hotel, add and remove amenities.', async function() {
    await wtHotelLib.wallet.createWallet('password123');
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: wtHotelLib.wallet.address, value: web3.toWei(5, 'ether')});
    assert.equal(web3.eth.getBalance(wtHotelLib.wallet.address), web3.toWei(5, 'ether'));
    wtHotelLib.setIndex(indexAddress);
    await wtHotelLib.createHotel('password123', 'WTHotel', 'Winding Tree Hotel');
    await wtHotelLib.updateHotels();
    let hotel = wtHotelLib.getHotel(wtHotelLib.hotelsAddrs[0]);
    assert.equal(hotel.name, 'WTHotel');
    assert.equal(hotel.description, 'Winding Tree Hotel');
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'BASIC');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room1', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room2', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room3', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addAmenity('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 1, 1);
    await wtHotelLib.addAmenity('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 2, 1);
    await wtHotelLib.addAmenity('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 2, 3);
    await wtHotelLib.addAmenity('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 2, 9);
    await wtHotelLib.updateHotels();
    hotel = wtHotelLib.getHotel(wtHotelLib.hotelsAddrs[0]);
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units.length, 3);
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units[0].amenities.length, 1);
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units[1].amenities.length, 3);
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units[2].amenities.length, 0);
    await wtHotelLib.removeAmenity('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 2, 3);
    await wtHotelLib.updateHotels();
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units.length, 3);
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units[0].amenities.length, 1);
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units[1].amenities.length, 2);
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units[2].amenities.length, 0);
  });

  it('Should create a hotel, create a unit type an upload new units and edit them.', async function() {
    await wtHotelLib.wallet.createWallet('password123');
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: wtHotelLib.wallet.address, value: web3.toWei(5, 'ether')});
    assert.equal(web3.eth.getBalance(wtHotelLib.wallet.address), web3.toWei(5, 'ether'));
    wtHotelLib.setIndex(indexAddress);
    await wtHotelLib.createHotel('password123', 'WTHotel', 'Winding Tree Hotel');
    await wtHotelLib.updateHotels();
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'BASIC');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room1', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.editUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 1, 'BasicRoom1', 'Basic Room 1', 1, 2, '12 USD');
    await wtHotelLib.updateHotels();
    let hotel = wtHotelLib.getHotel(wtHotelLib.hotelsAddrs[0]);
    assert.equal(hotel.name, 'WTHotel');
    assert.equal(hotel.description, 'Winding Tree Hotel');
    assert.equal(hotel.lineOne, '');
    assert.equal(hotel.lineTwo, '');
    assert.equal(hotel.zip, '');
    assert.equal(hotel.country, '');
    assert.equal(hotel.units.length, 1);
  });

  it('Should create a hotel, add a unitType, add and remove units in it', async function() {
    await wtHotelLib.wallet.createWallet('password123');
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: wtHotelLib.wallet.address, value: web3.toWei(5, 'ether')});
    assert.equal(web3.eth.getBalance(wtHotelLib.wallet.address), web3.toWei(5, 'ether'));
    wtHotelLib.setIndex(indexAddress);
    await wtHotelLib.createHotel('password123', 'WTHotel', 'Winding Tree Hotel');
    await wtHotelLib.updateHotels();
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'BASIC');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room1', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room2', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room3', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.updateHotels();
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units.length, 3);
    await wtHotelLib.removeUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 1);
    await wtHotelLib.updateHotels();
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units.length, 2);
  });

  it('Should create a hotel, add unitTypes and delete one of them.', async function() {
    await wtHotelLib.wallet.createWallet('password123');
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: wtHotelLib.wallet.address, value: web3.toWei(5, 'ether')});
    assert.equal(web3.eth.getBalance(wtHotelLib.wallet.address), web3.toWei(5, 'ether'));
    wtHotelLib.setIndex(indexAddress);
    await wtHotelLib.createHotel('password123', 'WTHotel', 'Winding Tree Hotel');
    await wtHotelLib.updateHotels();
    await wtHotelLib.changeHotelInfo('password123', wtHotelLib.hotelsAddrs[0], 'Awesome WTHotel', 'Awesome Winding Tree Hotel');
    await wtHotelLib.changeHotelAddress('password123', wtHotelLib.hotelsAddrs[0], 'Address one', 'Address two', '666', 'Spain');
    await wtHotelLib.changeHotelLocation('password123', wtHotelLib.hotelsAddrs[0], 1, wtHotelLib.utils.parseLongitude(15), wtHotelLib.utils.parseLatitude(50));
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'BASIC');
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'GOLD');
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'PLATINUM');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room1', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'GOLD', 'Room8', 'Gold Room', 2, 4, '30 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'PLATINUM', 'Room9', 'Platinum Room', 2, 5, '50 USD');
    await wtHotelLib.updateHotels();
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units.length, 3);
    await wtHotelLib.removeUnitType('password123', wtHotelLib.hotelsAddrs[0], 'GOLD');
    await wtHotelLib.updateHotels();
    assert.equal(wtHotelLib.hotels[wtHotelLib.hotelsAddrs[0]].units.length, 2);
  });

  it('Should create a hotel, edit his info, address and ubication, create a unit type, upload new units edit them and book them.', async function() {
    await wtHotelLib.wallet.createWallet('password123');
    await web3.eth.sendTransaction({from: web3.eth.accounts[0], to: wtHotelLib.wallet.address, value: web3.toWei(5, 'ether')});
    assert.equal(web3.eth.getBalance(wtHotelLib.wallet.address), web3.toWei(5, 'ether'));
    wtHotelLib.setIndex(indexAddress);
    await wtHotelLib.createHotel('password123', 'WTHotel', 'Winding Tree Hotel');
    await wtHotelLib.updateHotels();
    await wtHotelLib.changeHotelInfo('password123', wtHotelLib.hotelsAddrs[0], 'Awesome WTHotel', 'Awesome Winding Tree Hotel');
    await wtHotelLib.changeHotelAddress('password123', wtHotelLib.hotelsAddrs[0], 'Address one', 'Address two', '666', 'Spain');
    await wtHotelLib.changeHotelLocation('password123', wtHotelLib.hotelsAddrs[0], 1, wtHotelLib.utils.parseLongitude(15), wtHotelLib.utils.parseLatitude(50));
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'BASIC');
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'GOLD');
    await wtHotelLib.addUnitType('password123', wtHotelLib.hotelsAddrs[0], 'PLATINUM');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room1', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room2', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room3', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room4', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'BASIC', 'Room5', 'Basic Room', 1, 3, '10 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'GOLD', 'Room6', 'Gold Room', 2, 4, '30 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'GOLD', 'Room7', 'Gold Room', 2, 4, '30 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'GOLD', 'Room8', 'Gold Room', 2, 4, '30 USD');
    await wtHotelLib.addUnit('password123', wtHotelLib.hotelsAddrs[0], 'PLATINUM', 'Room9', 'Platinum Room', 2, 5, '50 USD');
    await wtHotelLib.updateHotels();
    let hotel = wtHotelLib.getHotel(wtHotelLib.hotelsAddrs[0]);
    assert.equal(hotel.name, 'Awesome WTHotel');
    assert.equal(hotel.description, 'Awesome Winding Tree Hotel');
    assert.equal(hotel.lineOne, 'Address one');
    assert.equal(hotel.lineTwo, 'Address two');
    assert.equal(hotel.zip, '666');
    assert.equal(hotel.country, 'Spain');
    assert.equal(hotel.timezone, '1');
    assert.equal(wtHotelLib.utils.formatLongitude(hotel.longitude), 15);
    assert.equal(wtHotelLib.utils.formatLatitude(hotel.latitude), 50);
    assert.equal(hotel.units.length, 9);
  });

});
