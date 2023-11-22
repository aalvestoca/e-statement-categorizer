# e-statement-categorizer
Banking e-Statement categorizer in Scotiabank text format  
  
## Example of pcbanking.txt
  
  ```
  ...  
  052 Nov 4 Nov 6 TIM HORTONS #5363 TORONTO ON 3.97
  053 Nov 4 Nov 6 CANADA AUTO PARKS QPL TORONTO ON 7.50
  054 Nov 4 Nov 6 LOBLAW TORONTO EGLINTO TORONTO ON 11.18
  057 Nov 4 Nov 6 PARAMOUNT FINE FOODS TORONTO ON 84.46
  ...
```
## Instructions
1. Copy the lines from your credit card bill
2. Paste the text to feed/pcbanking.txt

## Execution
node index

### Result
JSON object like this:
```
totals {
  supermarket: 498.34,
  pharmacy: 28.91,
  other: 67.77,
  commute: 117.5,
  delivery: 261.81,
  cafe: 58.51
}
```

## Testing
jest .

## Next steps
. Categories and places in database  
. Create an API for this categorizer  
. Develop front-end to consume the API  
. Front-end with PDF upload option
