// Demo rating table sheet: https://docs.google.com/spreadsheets/d/1Als2PzQPgDLuaEq2fRCtvHuXW0pIpN5y/edit?gid=877598933#gid=877598933

const bronzeCoverCSV = `,Sample Retail Travel Cover Rates,,,,,
,Net rates to MGA (excluding government levy or stamp duties),,,,,
,,,,,,
,Single Trip Rates,,,,,
,Days ,UK,Europe,Aus/NZ,WW ,WW inc USA/Can
,1 - 5 Days,5.38,8.69,15.05,15.77,23.76
,6 -10 Days,6.09,10.54,19.89,20.37,28.54
,11-19 Days,8.35,13.70,21.83,23.90,32.83
,20-31 Days,10.17,16.64,26.91,28.20,38.82
,or ,,,,,
,1-31 Days,7.49,13.21,21.84,22.78,32.92
,,,,,,
,Extra week,3.14,3.97,5.35,6.07,7.09
,Wedding ,5.30,4.92,5.05,4.98,5.37
,Gadget/Business,5.06,5.65,4.76,4.70,5.51
,Cruise ,2.59,3.16,2.33,2.95,2.75
,Golf,3.86,3.87,3.29,3.89,3.51
,Excess Waiver ,3.41,2.96,3.33,3.35,3.13
,Trip Disruption,4.53,4.97,4.36,4.79,5.04
,,,,,,
,* USA/Can includes SLI Cover,,,,,
,,,,,,
,Rating Guide,,,,,
,Adults  19-69 yrs ,,,,,
,Insureds 70-74 yrs  - 2 times (60 Days Max),,,,,
,Insureds 80-85 yrs - 3 times (45 Days Max),,,,,
,Children 3-18 yrs - 50% Adult Rate ,,,,,
,Family  - Double Adult Rate (2 Ads/Kids under 19yrs living at home),,,,,
,Wintersports - 1.75 Times Adult Rate (may age 69yrs),,,,,
,Private Health Members - 15% Reduction ,,,,,
,,,,,,
,Annual Multi Trip Insurance Rates,,,,,
,Insured,Europe,Worldwide,Europe,Worldwide,
,Excl Wintersports ,Health Members,Health Members,Non Members,Non Members,
,Adult ,35.40,44.73,42.21,49.57,
,Couple,46.71,62.02,53.30,71.13,
,Family ,47.25,68.07,54.37,79.54,
,,,,,,
,Insured,Europe,Worldwide,Europe,Worldwide,
,Incl Wintersports ,Health Members,Health Members,Non Members,Non Members,
,Adult ,39.46,52.01,41.92,58.48,
,Couple,54.32,68.98,60.89,82.62,
,Family ,68.53,76.44,74.97,93.43,
,,,,,,
,Extra Covers,,,,,
,Wedding ,5.24,6.43,5.04,6.42,
,Golf ,5.44,5.68,5.63,5.98,
,Excess Waiver ,6.18,7.33,5.61,7.46,
,Gadget/Business,5.31,6.22,5.37,6.31,
,Cruise ,4.67,5.63,4.39,5.56,
,Trip Disruption,11.16,11.44,10.64,11.51,
,,,,,,
,* USA/Can includes SLI Cover,,,,,
,,,,,,
,Rating Guide ,,,,,
,Adults 19-69 years - 65 Days any one trip,,,,,
,Adults 70-75 years - 2 Times Adult Rate (25 Days any one trip / Health Members only),,,,,
,Adults 75-80 years - 4 times Adult Rate (14 Days any one trip / Health Members only),,,,,
,Wintersports Cover - Up to 25 Days any one ski trip. Max age 69 yrs ,,,,,
,Family Defintion - 2 Adults and all children up to 19 yrs living at home,,,,,`;

const silverCoverCSV = `,Sample Retail Travel Cover Rates,,,,,
,Net rates to MGA (excluding government levy or stamp duties),,,,,
,,,,,,
,Single Trip Rates,,,,,
,Days ,UK,Europe,Aus/NZ,WW ,WW inc USA/Can
,1 - 5 Days ,9.67,13.07,14.81,19.33,27.13
,6 -10 Days ,10.90,17.00,19.46,22.17,31.96
,11-19 Days ,12.84,18.75,23.53,25.48,35.65
,20-31 Days ,14.67,22.61,27.99,31.17,40.43
,or ,,,,,
,1-31 Days,11.46,17.90,22.63,25.11,34.84
,,,,,,
,Extra week,4.36,4.44,5.89,6.82,8.18
,Wedding ,5.21,5.84,5.71,5.36,5.74
,Gadget/Business,5.53,5.91,6.30,5.56,5.75
,Cruise ,3.42,3.81,3.79,3.64,4.00
,Golf,4.80,4.99,4.68,4.71,5.09
,Excess Waiver ,Included ,Included ,Included ,Included ,Included 
,Trip Disruption,Included ,Included ,Included ,Included ,Included 
,,,,,,
,* USA/Can includes SLI Cover,,,,,
,,,,,,
,Rating Guide,,,,,
,Adults  19-69 yrs ,,,,,
,Insureds 70-74 yrs  - 2 times (60 Days Max),,,,,
,Insureds 80-85 yrs - 3 times (45 Days Max),,,,,
,Children 3-18 yrs - 50% Adult Rate ,,,,,
,Family  - Double Adult Rate (2 Ads/Kids under 19yrs living at home),,,,,
,Wintersports - 1.75 Times Adult Rate (may age 69yrs),,,,,
,Private Health Members - 15% Reduction ,,,,,
,,,,,,
,Annual Multi Trip Insurance Rates,,,,,
,Insured,Europe,Worldwide,Europe,Worldwide,
,Excl Wintersports ,Health Members,Health Members,Non Members,Non Members,
,Adult ,39.41,53.63,46.21,53.33,
,Couple,55.05,68.58,62.34,75.62,
,Family ,58.12,72.29,65.95,88.89,
,,,,,,
,Insured,Europe,Worldwide,Europe,Worldwide,
,Incl Wintersports ,Health Members,Health Members,Non Members,Non Members,
,Adult ,44.62,62.35,48.73,58.89,
,Couple,62.19,72.27,65.93,83.05,
,Family ,71.43,79.80,6.39,93.32,
,,,,,,
,Extra Covers,,,,,
,Wedding ,5.75,6.65,5.80,6.79,
,Golf ,5.15,6.36,5.62,6.86,
,Excess Waiver ,Included ,Included ,Included ,Included ,
,Gadget/Business,5.24,6.82,5.88,7.07,
,Cruise ,5.00,6.47,5.58,5.74,
,Trip Disruption,Included ,Included ,Included ,Included ,
,,,,,,
,* USA/Can includes SLI Cover,,,,,
,,,,,,
,Rating Guide ,,,,,
,Adults 19-69 years - 65 Days any one trip,,,,,
,Adults 70-75 years - 2 Times Adult Rate (25 Days any one trip / Health Members only),,,,,
,Adults 75-80 years - 4 times Adult Rate (14 Days any one trip / Health Members only),,,,,
,Wintersports Cover - Up to 25 Days any one ski trip. Max age 69 yrs ,,,,,
,Family Defintion - 2 Adults and all children up to 19 yrs living at home,,,,,`;

const goldCoverCSV = `,Sample Retail Travel Cover Rates,,,,,
,Net rates to MGA (excluding government levy or stamp duties),,,,,
,,,,,,
,Single Trip Rates,,,,,
,Days ,UK,Europe,Aus/NZ,WW ,WW inc USA/Can
,1 - 5 Days ,10.26,14.01,15.68,19.95,27.22
,6 -10 Days ,11.31,17.10,19.95,22.33,32.21
,11-19 Days ,13.25,19.48,23.70,25.98,36.05
,20-31 Days ,15.06,22.80,28.45,31.30,40.76
,or ,,,,,
,1-31 Days,12.30,18.34,22.80,25.41,35.06
,,,,,,
,Extra week,4.70,5.23,6.18,7.79,8.84
,Wedding ,5.89,5.89,5.89,5.89,5.89
,Gadget/Business,6.41,6.41,6.41,6.41,6.41
,Cruise ,4.28,4.28,4.28,4.28,4.28
,Golf,5.46,5.46,5.46,5.46,5.46
,Excess Waiver ,Included ,Included ,Included ,Included ,Included 
,Trip Disruption,Included ,Included ,Included ,Included ,Included 
,,,,,,
,* USA/Can includes SLI Cover,,,,,
,,,,,,
,Rating Guide,,,,,
,Adults  19-69 yrs ,,,,,
,Insureds 70-74 yrs  - 2 times (60 Days Max),,,,,
,Insureds 80-85 yrs - 3 times (45 Days Max),,,,,
,Children 3-18 yrs - 50% Adult Rate ,,,,,
,Family  - Double Adult Rate (2 Ads/Kids under 19yrs living at home),,,,,
,Wintersports - 1.75 Times Adult Rate (may age 69yrs),,,,,
,Private Health Members - 15% Reduction ,,,,,
,,,,,,
,Annual Multi Trip Insurance Rates,,,,,
,Insured,Europe,Worldwide,Europe,Worldwide,
,Excl Wintersports ,Health Members,Health Members,Non Members,Non Members,
,Adult ,39.07,53.39,45.80,53.42,
,Couple,55.75,68.79,62.40,75.38,
,Family ,58.27,72.97,66.13,89.27,
,,,,,,
,Insured,Europe,Worldwide,Europe,Worldwide,
,Incl Wintersports ,Health Members,Health Members,Non Members,Non Members,
,Adult ,45.26,61.79,49.32,59.20,
,Couple,62.02,72.84,65.06,83.08,
,Family ,72.04,80.13,6.35,93.17,
,,,,,,
,Extra Covers,,,,,
,Wedding ,5.64,6.90,5.72,7.01,
,Golf ,5.42,6.15,5.38,6.87,
,Excess Waiver ,Included ,Included ,Included ,Included ,
,Gadget/Business,5.97,7.04,5.83,6.64,
,Cruise ,5.58,5.98,5.13,6.51,
,Trip Disruption,Included ,Included ,Included ,Included ,
,,,,,,
,* USA/Can includes SLI Cover,,,,,
,,,,,,
,Rating Guide ,,,,,
,Adults 19-69 years - 65 Days any one trip,,,,,
,Adults 70-75 years - 2 Times Adult Rate (25 Days any one trip / Health Members only),,,,,
,Adults 75-80 years - 4 times Adult Rate (14 Days any one trip / Health Members only),,,,,
,Wintersports Cover - Up to 25 Days any one ski trip. Max age 69 yrs ,,,,,
,Family Defintion - 2 Adults and all children up to 19 yrs living at home,,,,,`;

const longStayRatesCSV = `,Sample Retail Travel Cover Rates,,,,
,Net rates to MGA (excluding government levy or stamp duties),,,,
,,,,,
,,,,,
,Long Stay Rates,,,,
,Days ,UK/Europe,Aus/NZ,WW Excl,WW inc USA/Can
,31 days ,27.22,31.49,36.95,52.56
,60 Days ,27.41,31.72,36.78,52.49
,90 Days ,30.15,37.75,42.93,59.41
,120 Days ,39.09,47.81,56.98,73.91
,150 Days ,50.33,53.46,68.48,88.77
,180 Days ,62.55,64.08,80.19,101.59
,270 Days ,80.57,91.38,102.53,126.81
,365 Days ,97.70,106.15,112.29,148.13
,730 Days (2 years),194.42,216.02,228.80,285.75
,,,,,
,Additional Covers,,,,
,Exam Failure,14.02,14.33,14.34,14.25
,Excess Waiver ,5.55,5.99,5.79,5.87
,Wintersports ,27.57,27.44,27.38,27.58
,Trip Disruption ,9.40,9.34,9.46,9.34
,,,,,
,Rating Guide,,,,
,Adults  19-49 yrs ,,,,
,Private Health Members - 15% Reduction ,,,,`;
