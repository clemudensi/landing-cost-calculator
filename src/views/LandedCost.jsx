import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

const origin = [
  {
    value: 'nigeria',
    label: 'NG',
  },
  {
    value: 'ghana',
    label: 'GH',
  },
  {
    value: 'rsa',
    label: 'RSA',
  },
  {
    value: 'senegal',
    label: 'SG',
  },
  {
    value: 'kenya',
    label: 'KN',
  },
  {
    value: 'ivory_coast',
    label: 'IVR',
  },
];

const destination = [
  {
    value: 'usa',
    label: 'USA',
  },
  {
    value: 'europe',
    label: 'EU',
  }
];

const goodsType = [
  {
    value: 'non perishable',
    label: 'Non perishable',
  },
  {
    value: 'perishable',
    label: 'Perishable',
  }
];

const units = [
  {
    value: 0.4535,
    label: 'lbs',
  },
  {
    value: 1,
    label: 'kg',
  },
  {
    value: 1000,
    label: 'Mt.',
  },
];

class LandedCost extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      origin: 'ghana',
      destination: 'usa',
      number: '',
      weight: '',
      price: '',
      distancePort: '',
      distanceBuyer: '',
      goodsType: 'non perishable',
      units: '',
      result: false,
      route: []
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleOrigin = event => {
    this.setState({
      origin: event.target.value,
    });
  };

  handleDestination = event => {
    this.setState({
      destination: event.target.value,
    });
  };

  handleGoodsType = event => {
    this.setState({
      goodsType: event.target.value,
    });
  };

  handleUnits = event => {
    this.setState({
      units: event.target.value,
    });
  };

  onClickResult = () => {
    this.setState({result: true});
  };

  commodityPrice(){
    return this.state.price * this.state.number
  }

  transportToPort() {
    const vehicles = [
      {
        "capacity": 1360,
        "pricePerKm": 20,
        "weightLimit": 2800,
        "name": "truck",
        "vehicleType": "non perishable"
      },
      {
        "capacity": 800,
        "pricePerKm": 12,
        "weightLimit": 1800,
        "name": "lorry",
        "vehicleType": "non perishable"
      },
      {
        "capacity": 500,
        "pricePerKm": 6.2,
        "weightLimit": 980,
        "name": "van",
        "vehicleType": "non perishable"
      },
      {
        "capacity": 1360,
        "pricePerKm": 25,
        "weightLimit": 2500,
        "name": "truck",
        "vehicleType": "perishable"
      },
      {
        "capacity": 900,
        "pricePerKm": 15,
        "weightLimit": 1600,
        "name": "lorry",
        "vehicleType": "perishable"
      },
      {
        "capacity": 560,
        "pricePerKm": 15,
        "weightLimit": 920,
        "name": "van",
        "vehicleType": "perishable"
      }
    ];
    const {goodsType, distancePort, weight} = this.state;

    //sort vehicle size in ascending order
    const tripSort = vehicles.sort(function(a, b) {
      return a.capacity - b.capacity;
    });

    const largestTruckSize = tripSort.slice(-1)[0];

    // find vehicle that matches volume of item
    let tripCost = tripSort.find(value => {
      return weight < value.weightLimit &&  value.type === goodsType
    });

    const requiredTrips = (Math.round((this.state.weight/largestTruckSize.weightLimit) * 100)/100);

    const largeTrips = Math.floor(requiredTrips);
    const largeTripCost = largeTrips * largestTruckSize.pricePerKm * distancePort;
    const weightFraction = (requiredTrips % 1) * largestTruckSize.weightLimit;
    const requiredTruck = tripSort.find((value) => { return weightFraction < value.capacity &&  value.vehicleType === goodsType});
    const smallTripCost = requiredTruck.pricePerKm * distancePort;
    const totalCostTrip = largeTripCost + smallTripCost;
    return tripCost ? tripCost : totalCostTrip
  }

  originFuelSurcharge(){
    return 0.05 * this.transportToPort()
  }

  exportDuties(){
    // note that flat fee and percentage duty varies per country
    return 0.03 * this.commodityPrice() + 200
  }

  originExcessFee(){
    const { number} = this.state;
    if(number < 20000) return 0;
    if(number > 20000) return ((number - 20000) * 0.5 + 200)
  }

  originFreightFee(){
    return 300
  }

  shippingCost(){
    const {weight} = this.state;
    return 1.65 * weight
  }

  cargoInsurance(){
    return 0.05 * this.shippingCost()
  }

  destinationExcessFee(){
    const {number} = this.state
    if(number < 19500) return 0;
    if(number > 19500) return ((number - 19500) * 0.5 + 180)
  }

  destinationFreightFee() {
    return 250
  }

  transportToBuyer(){
    const vehicles = [
      {
        "capacity": 1360,
        "pricePerKm": 17,
        "weightLimit": 3150,
        "name": "truck",
        "vehicleType": "non perishable"
      },
      {
        "capacity": 850,
        "pricePerKm": 10,
        "weightLimit": 2000,
        "name": "lorry",
        "vehicleType": "non perishable"
      },
      {
        "capacity": 500,
        "pricePerKm": 6,
        "weightLimit": 1400,
        "name": "van",
        "vehicleType": "non perishable"
      },
      {
        "capacity": 1360,
        "pricePerKm": 22,
        "weightLimit": 2300,
        "name": "truck",
        "vehicleType": "perishable"
      },
      {
        "capacity": 920,
        "pricePerKm": 15,
        "weightLimit": 1550,
        "name": "lorry",
        "vehicleType": "perishable"
      },
      {
        "capacity": 530,
        "pricePerKm": 12.5,
        "weightLimit": 850,
        "name": "van",
        "vehicleType": "perishable"
      }
    ];

    const tripSort = vehicles.sort(function(a, b) {
      return a.capacity - b.capacity;
    });
    const largestTruckSize = tripSort.slice(-1)[0];
    let tripCost = tripSort.find(value => {
      return this.state.weight < value.weightLimit &&  value.type === this.state.goodsType
    });
    const requiredTrips = (Math.round((this.state.weight/largestTruckSize.weightLimit) * 100)/100);
    const largeTrips = Math.floor(requiredTrips);
    const largeTripCost = largeTrips * largestTruckSize.pricePerKm * this.state.distanceBuyer;
    const weightFraction =  (requiredTrips % 1) * largestTruckSize.weightLimit;
    const requiredTruck = tripSort.find((value) => { return weightFraction < value.capacity &&  value.vehicleType === this.state.goodsType});
    const smallTripCost = requiredTruck.pricePerKm * this.state.distanceBuyer;
    const totalTripCost = largeTripCost + smallTripCost;
    return tripCost ? tripCost : totalTripCost
  }

  destinationFuelSurchage(){
    return 0.04 * this.transportToBuyer()
  }

  importDuties(){
    return 0.15 * 175
  }

  landedCost = () =>{
    const total = [this.commodityPrice(), this.transportToPort(), this.originFuelSurcharge(), this.exportDuties(), this.originExcessFee(), this.originFreightFee(), this.cargoInsurance(), this.shippingCost(), this.destinationFreightFee(), this.destinationExcessFee(), this.transportToBuyer(),  this.destinationFuelSurchage(), this.importDuties()]
    const landedCost = (total.reduce((a, b) => a + b, 0)/this.state.number) * this.state.units;
    if (this.state.units === 1) return `landed cost for this item is $${landedCost} per kg`;
    if (this.state.units === 0.4535) return `landed cost for this item is $${landedCost} per lbs`;
    if (this.state.units === 1000) return `landed cost for this item is $${landedCost} per Mt.`;
  };

  render(){
    const { classes } = this.props;
    return(
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid item xs={12}>
            <h2 align="center">JetStream Landed Cost calculator</h2>
            <br/>
            <TextField
              id="outlined-number"
              label="Number of items"
              value={this.state.number}
              onChange={this.handleChange('number')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-number"
              label="Price per Commodity"
              value={this.state.price}
              onChange={this.handleChange('price')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-number"
              label="Weight of item"
              value={this.state.weight}
              onChange={this.handleChange('weight')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-number"
              label="Distance to Port"
              value={this.state.distancePort}
              onChange={this.handleChange('distancePort')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-select-origin"
              select
              label="Origin"
              className={classes.textField}
              value={this.state.origin}
              onChange={this.handleOrigin}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select your country of origin"
              margin="normal"
              variant="outlined"
            >
              {origin.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-destination"
              select
              label="Destination"
              className={classes.textField}
              value={this.state.destination}
              onChange={this.handleDestination}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select your country of destination"
              margin="normal"
              variant="outlined"
            >
              {destination.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-number"
              label="Distance to Buyer"
              value={this.state.distanceBuyer}
              onChange={this.handleChange('distanceBuyer')}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
            />

            <TextField
              id="outlined-select-destination"
              select
              label="Goods Type"
              className={classes.textField}
              value={this.state.goodsType}
              onChange={this.handleGoodsType}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Please select your country of destination"
              margin="normal"
              variant="outlined"
            >
              {goodsType.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="outlined-select-destination"
              select
              label="Units of Measurement"
              className={classes.textField}
              value={this.state.units}
              onChange={this.handleUnits}
              SelectProps={{
                MenuProps: {
                  className: classes.menu,
                },
              }}
              helperText="Select a unit of weight"
              margin="normal"
              variant="outlined"
            >
              {units.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </form>
        <div>
          <p>{this.state.result ? this.landedCost() : null}</p>
          <br/>
          <button onClick={this.onClickResult}>Landed Cost</button>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(LandedCost);
