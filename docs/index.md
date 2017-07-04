# Winding Tree Javascript Libraries

This libraries can be used on a nodejs application/server or on browsers. The intention of them is to provide the user all the necesary tools and methods to interact and get information from the WT platform, hosted entirely on the Ethereum Blockchain.

All the information on the blockchian is public, so every user can access to it, he only need to make a query to the blockchian itself. All the data is indexed from one contract so the only thing the user needs is an address.

Every user that wants to edit or submit new data to our platform will need an ethereum address, and we provide a solution for it, using eth-lightwallet, an open source library to manage ethereum accounts safely.

## WTHotel Lib

### Constructor
```
WTHotel({
  keys: {
    publicKey: "PUBLIC_KEY_STRING",
    privateKey: "PRIVATE_KEY_STRING"
  }
  wallet: {
    web3Provider: "http://localhost:8545"
  }
  hotels: {
    ...
  }
  indexAddress: "0x123456..."
})

```

### setIndex
```
  WTHotel.setIndex(indexAddress);
```

### updateHotels
```
  WTHotel.updateHotels()
```

### updateHotels
```
  WTHotel.updateHotel(hotelAddress)
```

### createHotel
```
  WTHotel.createHotel(password, name, description)
```

### changeHotelInfo
```
WTHotel.changeHotelInfo(password, hotelAddress, name, description)
```

### changeHotelAddress
```
WTHotel.changeHotelAddress(password, hotelAddress, lineOne, lineTwo, zipCode, country)
```

### changeHotelLocation
```
WTHotel.changeHotelLocation(password, hotelAddress, timezone, latitude, longitude)
```

### addUnitType
```
WTHotel.addUnitType(password, hotelAddress, unitTypeName)
```

### addUnit
```
WTHotel.addUnit(password, hotelAddress, unitType, name, description, minGuests, maxGuests, price)
```

### editUnit
```
WTHotel.editUnit(password, hotelAddress, unitType, index, name, description, minGuests, maxGuests, price)
```

### getBookings
```
WTHotel.getBookings()
```

### getHotels
```
WTHotel.getHotels()
```

### getHotelsAddrs
```
WTHotel.getHotelsAddrs()
```

### getHotel
```
WTHotel.getHotel(hotelAddress)
```
