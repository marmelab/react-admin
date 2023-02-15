const countries = [
    {
        name: 'Ascension Island',
        code: 'AC',
        emoji: '🇦🇨',
    },
    {
        name: 'Andorra',
        code: 'AD',
        emoji: '🇦🇩',
    },
    {
        name: 'United Arab Emirates',
        code: 'AE',
        emoji: '🇦🇪',
    },
    {
        name: 'Afghanistan',
        code: 'AF',
        emoji: '🇦🇫',
    },
    {
        name: 'Antigua & Barbuda',
        code: 'AG',
        emoji: '🇦🇬',
    },
    {
        name: 'Anguilla',
        code: 'AI',
        emoji: '🇦🇮',
    },
    {
        name: 'Albania',
        code: 'AL',
        emoji: '🇦🇱',
    },
    {
        name: 'Armenia',
        code: 'AM',
        emoji: '🇦🇲',
    },
    {
        name: 'Angola',
        code: 'AO',
        emoji: '🇦🇴',
    },
    {
        name: 'Antarctica',
        code: 'AQ',
        emoji: '🇦🇶',
    },
    {
        name: 'Argentina',
        code: 'AR',
        emoji: '🇦🇷',
    },
    {
        name: 'American Samoa',
        code: 'AS',
        emoji: '🇦🇸',
    },
    {
        name: 'Austria',
        code: 'AT',
        emoji: '🇦🇹',
    },
    {
        name: 'Australia',
        code: 'AU',
        emoji: '🇦🇺',
    },
    {
        name: 'Aruba',
        code: 'AW',
        emoji: '🇦🇼',
    },
    {
        name: 'Åland Islands',
        code: 'AX',
        emoji: '🇦🇽',
    },
    {
        name: 'Azerbaijan',
        code: 'AZ',
        emoji: '🇦🇿',
    },
    {
        name: 'Bosnia & Herzegovina',
        code: 'BA',
        emoji: '🇧🇦',
    },
    {
        name: 'Barbados',
        code: 'BB',
        emoji: '🇧🇧',
    },
    {
        name: 'Bangladesh',
        code: 'BD',
        emoji: '🇧🇩',
    },
    {
        name: 'Belgium',
        code: 'BE',
        emoji: '🇧🇪',
    },
    {
        name: 'Burkina Faso',
        code: 'BF',
        emoji: '🇧🇫',
    },
    {
        name: 'Bulgaria',
        code: 'BG',
        emoji: '🇧🇬',
    },
    {
        name: 'Bahrain',
        code: 'BH',
        emoji: '🇧🇭',
    },
    {
        name: 'Burundi',
        code: 'BI',
        emoji: '🇧🇮',
    },
    {
        name: 'Benin',
        code: 'BJ',
        emoji: '🇧🇯',
    },
    {
        name: 'St. Barthélemy',
        code: 'BL',
        emoji: '🇧🇱',
    },
    {
        name: 'Bermuda',
        code: 'BM',
        emoji: '🇧🇲',
    },
    {
        name: 'Brunei',
        code: 'BN',
        emoji: '🇧🇳',
    },
    {
        name: 'Bolivia',
        code: 'BO',
        emoji: '🇧🇴',
    },
    {
        name: 'Caribbean Netherlands',
        code: 'BQ',
        emoji: '🇧🇶',
    },
    {
        name: 'Brazil',
        code: 'BR',
        emoji: '🇧🇷',
    },
    {
        name: 'Bahamas',
        code: 'BS',
        emoji: '🇧🇸',
    },
    {
        name: 'Bhutan',
        code: 'BT',
        emoji: '🇧🇹',
    },
    {
        name: 'Bouvet Island',
        code: 'BV',
        emoji: '🇧🇻',
    },
    {
        name: 'Botswana',
        code: 'BW',
        emoji: '🇧🇼',
    },
    {
        name: 'Belarus',
        code: 'BY',
        emoji: '🇧🇾',
    },
    {
        name: 'Belize',
        code: 'BZ',
        emoji: '🇧🇿',
    },
    {
        name: 'Canada',
        code: 'CA',
        emoji: '🇨🇦',
    },
    {
        name: 'Cocos (Keeling) Islands',
        code: 'CC',
        emoji: '🇨🇨',
    },
    {
        name: 'Congo - Kinshasa',
        code: 'CD',
        emoji: '🇨🇩',
    },
    {
        name: 'Central African Republic',
        code: 'CF',
        emoji: '🇨🇫',
    },
    {
        name: 'Congo - Brazzaville',
        code: 'CG',
        emoji: '🇨🇬',
    },
    {
        name: 'Switzerland',
        code: 'CH',
        emoji: '🇨🇭',
    },
    {
        name: 'Côte d’Ivoire',
        code: 'CI',
        emoji: '🇨🇮',
    },
    {
        name: 'Cook Islands',
        code: 'CK',
        emoji: '🇨🇰',
    },
    {
        name: 'Chile',
        code: 'CL',
        emoji: '🇨🇱',
    },
    {
        name: 'Cameroon',
        code: 'CM',
        emoji: '🇨🇲',
    },
    {
        name: 'China',
        code: 'CN',
        emoji: '🇨🇳',
    },
    {
        name: 'Colombia',
        code: 'CO',
        emoji: '🇨🇴',
    },
    {
        name: 'Clipperton Island',
        code: 'CP',
        emoji: '🇨🇵',
    },
    {
        name: 'Costa Rica',
        code: 'CR',
        emoji: '🇨🇷',
    },
    {
        name: 'Cuba',
        code: 'CU',
        emoji: '🇨🇺',
    },
    {
        name: 'Cape Verde',
        code: 'CV',
        emoji: '🇨🇻',
    },
    {
        name: 'Curaçao',
        code: 'CW',
        emoji: '🇨🇼',
    },
    {
        name: 'Christmas Island',
        code: 'CX',
        emoji: '🇨🇽',
    },
    {
        name: 'Cyprus',
        code: 'CY',
        emoji: '🇨🇾',
    },
    {
        name: 'Czechia',
        code: 'CZ',
        emoji: '🇨🇿',
    },
    {
        name: 'Germany',
        code: 'DE',
        emoji: '🇩🇪',
    },
    {
        name: 'Diego Garcia',
        code: 'DG',
        emoji: '🇩🇬',
    },
    {
        name: 'Djibouti',
        code: 'DJ',
        emoji: '🇩🇯',
    },
    {
        name: 'Denmark',
        code: 'DK',
        emoji: '🇩🇰',
    },
    {
        name: 'Dominica',
        code: 'DM',
        emoji: '🇩🇲',
    },
    {
        name: 'Dominican Republic',
        code: 'DO',
        emoji: '🇩🇴',
    },
    {
        name: 'Algeria',
        code: 'DZ',
        emoji: '🇩🇿',
    },
    {
        name: 'Ceuta & Melilla',
        code: 'EA',
        emoji: '🇪🇦',
    },
    {
        name: 'Ecuador',
        code: 'EC',
        emoji: '🇪🇨',
    },
    {
        name: 'Estonia',
        code: 'EE',
        emoji: '🇪🇪',
    },
    {
        name: 'Egypt',
        code: 'EG',
        emoji: '🇪🇬',
    },
    {
        name: 'Western Sahara',
        code: 'EH',
        emoji: '🇪🇭',
    },
    {
        name: 'Eritrea',
        code: 'ER',
        emoji: '🇪🇷',
    },
    {
        name: 'Spain',
        code: 'ES',
        emoji: '🇪🇸',
    },
    {
        name: 'Ethiopia',
        code: 'ET',
        emoji: '🇪🇹',
    },
    {
        name: 'European Union',
        code: 'EU',
        emoji: '🇪🇺',
    },
    {
        name: 'Finland',
        code: 'FI',
        emoji: '🇫🇮',
    },
    {
        name: 'Fiji',
        code: 'FJ',
        emoji: '🇫🇯',
    },
    {
        name: 'Falkland Islands',
        code: 'FK',
        emoji: '🇫🇰',
    },
    {
        name: 'Micronesia',
        code: 'FM',
        emoji: '🇫🇲',
    },
    {
        name: 'Faroe Islands',
        code: 'FO',
        emoji: '🇫🇴',
    },
    {
        name: 'France',
        code: 'FR',
        emoji: '🇫🇷',
    },
    {
        name: 'Gabon',
        code: 'GA',
        emoji: '🇬🇦',
    },
    {
        name: 'United Kingdom',
        code: 'GB',
        emoji: '🇬🇧',
    },
    {
        name: 'Grenada',
        code: 'GD',
        emoji: '🇬🇩',
    },
    {
        name: 'Georgia',
        code: 'GE',
        emoji: '🇬🇪',
    },
    {
        name: 'French Guiana',
        code: 'GF',
        emoji: '🇬🇫',
    },
    {
        name: 'Guernsey',
        code: 'GG',
        emoji: '🇬🇬',
    },
    {
        name: 'Ghana',
        code: 'GH',
        emoji: '🇬🇭',
    },
    {
        name: 'Gibraltar',
        code: 'GI',
        emoji: '🇬🇮',
    },
    {
        name: 'Greenland',
        code: 'GL',
        emoji: '🇬🇱',
    },
    {
        name: 'Gambia',
        code: 'GM',
        emoji: '🇬🇲',
    },
    {
        name: 'Guinea',
        code: 'GN',
        emoji: '🇬🇳',
    },
    {
        name: 'Guadeloupe',
        code: 'GP',
        emoji: '🇬🇵',
    },
    {
        name: 'Equatorial Guinea',
        code: 'GQ',
        emoji: '🇬🇶',
    },
    {
        name: 'Greece',
        code: 'GR',
        emoji: '🇬🇷',
    },
    {
        name: 'South Georgia & South Sandwich Islands',
        code: 'GS',
        emoji: '🇬🇸',
    },
    {
        name: 'Guatemala',
        code: 'GT',
        emoji: '🇬🇹',
    },
    {
        name: 'Guam',
        code: 'GU',
        emoji: '🇬🇺',
    },
    {
        name: 'Guinea-Bissau',
        code: 'GW',
        emoji: '🇬🇼',
    },
    {
        name: 'Guyana',
        code: 'GY',
        emoji: '🇬🇾',
    },
    {
        name: 'Hong Kong SAR China',
        code: 'HK',
        emoji: '🇭🇰',
    },
    {
        name: 'Heard & McDonald Islands',
        code: 'HM',
        emoji: '🇭🇲',
    },
    {
        name: 'Honduras',
        code: 'HN',
        emoji: '🇭🇳',
    },
    {
        name: 'Croatia',
        code: 'HR',
        emoji: '🇭🇷',
    },
    {
        name: 'Haiti',
        code: 'HT',
        emoji: '🇭🇹',
    },
    {
        name: 'Hungary',
        code: 'HU',
        emoji: '🇭🇺',
    },
    {
        name: 'Canary Islands',
        code: 'IC',
        emoji: '🇮🇨',
    },
    {
        name: 'Indonesia',
        code: 'ID',
        emoji: '🇮🇩',
    },
    {
        name: 'Ireland',
        code: 'IE',
        emoji: '🇮🇪',
    },
    {
        name: 'Israel',
        code: 'IL',
        emoji: '🇮🇱',
    },
    {
        name: 'Isle of Man',
        code: 'IM',
        emoji: '🇮🇲',
    },
    {
        name: 'India',
        code: 'IN',
        emoji: '🇮🇳',
    },
    {
        name: 'British Indian Ocean Territory',
        code: 'IO',
        emoji: '🇮🇴',
    },
    {
        name: 'Iraq',
        code: 'IQ',
        emoji: '🇮🇶',
    },
    {
        name: 'Iran',
        code: 'IR',
        emoji: '🇮🇷',
    },
    {
        name: 'Iceland',
        code: 'IS',
        emoji: '🇮🇸',
    },
    {
        name: 'Italy',
        code: 'IT',
        emoji: '🇮🇹',
    },
    {
        name: 'Jersey',
        code: 'JE',
        emoji: '🇯🇪',
    },
    {
        name: 'Jamaica',
        code: 'JM',
        emoji: '🇯🇲',
    },
    {
        name: 'Jordan',
        code: 'JO',
        emoji: '🇯🇴',
    },
    {
        name: 'Japan',
        code: 'JP',
        emoji: '🇯🇵',
    },
    {
        name: 'Kenya',
        code: 'KE',
        emoji: '🇰🇪',
    },
    {
        name: 'Kyrgyzstan',
        code: 'KG',
        emoji: '🇰🇬',
    },
    {
        name: 'Cambodia',
        code: 'KH',
        emoji: '🇰🇭',
    },
    {
        name: 'Kiribati',
        code: 'KI',
        emoji: '🇰🇮',
    },
    {
        name: 'Comoros',
        code: 'KM',
        emoji: '🇰🇲',
    },
    {
        name: 'St. Kitts & Nevis',
        code: 'KN',
        emoji: '🇰🇳',
    },
    {
        name: 'North Korea',
        code: 'KP',
        emoji: '🇰🇵',
    },
    {
        name: 'South Korea',
        code: 'KR',
        emoji: '🇰🇷',
    },
    {
        name: 'Kuwait',
        code: 'KW',
        emoji: '🇰🇼',
    },
    {
        name: 'Cayman Islands',
        code: 'KY',
        emoji: '🇰🇾',
    },
    {
        name: 'Kazakhstan',
        code: 'KZ',
        emoji: '🇰🇿',
    },
    {
        name: 'Laos',
        code: 'LA',
        emoji: '🇱🇦',
    },
    {
        name: 'Lebanon',
        code: 'LB',
        emoji: '🇱🇧',
    },
    {
        name: 'St. Lucia',
        code: 'LC',
        emoji: '🇱🇨',
    },
    {
        name: 'Liechtenstein',
        code: 'LI',
        emoji: '🇱🇮',
    },
    {
        name: 'Sri Lanka',
        code: 'LK',
        emoji: '🇱🇰',
    },
    {
        name: 'Liberia',
        code: 'LR',
        emoji: '🇱🇷',
    },
    {
        name: 'Lesotho',
        code: 'LS',
        emoji: '🇱🇸',
    },
    {
        name: 'Lithuania',
        code: 'LT',
        emoji: '🇱🇹',
    },
    {
        name: 'Luxembourg',
        code: 'LU',
        emoji: '🇱🇺',
    },
    {
        name: 'Latvia',
        code: 'LV',
        emoji: '🇱🇻',
    },
    {
        name: 'Libya',
        code: 'LY',
        emoji: '🇱🇾',
    },
    {
        name: 'Morocco',
        code: 'MA',
        emoji: '🇲🇦',
    },
    {
        name: 'Monaco',
        code: 'MC',
        emoji: '🇲🇨',
    },
    {
        name: 'Moldova',
        code: 'MD',
        emoji: '🇲🇩',
    },
    {
        name: 'Montenegro',
        code: 'ME',
        emoji: '🇲🇪',
    },
    {
        name: 'St. Martin',
        code: 'MF',
        emoji: '🇲🇫',
    },
    {
        name: 'Madagascar',
        code: 'MG',
        emoji: '🇲🇬',
    },
    {
        name: 'Marshall Islands',
        code: 'MH',
        emoji: '🇲🇭',
    },
    {
        name: 'North Macedonia',
        code: 'MK',
        emoji: '🇲🇰',
    },
    {
        name: 'Mali',
        code: 'ML',
        emoji: '🇲🇱',
    },
    {
        name: 'Myanmar (Burma)',
        code: 'MM',
        emoji: '🇲🇲',
    },
    {
        name: 'Mongolia',
        code: 'MN',
        emoji: '🇲🇳',
    },
    {
        name: 'Macao SAR China',
        code: 'MO',
        emoji: '🇲🇴',
    },
    {
        name: 'Northern Mariana Islands',
        code: 'MP',
        emoji: '🇲🇵',
    },
    {
        name: 'Martinique',
        code: 'MQ',
        emoji: '🇲🇶',
    },
    {
        name: 'Mauritania',
        code: 'MR',
        emoji: '🇲🇷',
    },
    {
        name: 'Montserrat',
        code: 'MS',
        emoji: '🇲🇸',
    },
    {
        name: 'Malta',
        code: 'MT',
        emoji: '🇲🇹',
    },
    {
        name: 'Mauritius',
        code: 'MU',
        emoji: '🇲🇺',
    },
    {
        name: 'Maldives',
        code: 'MV',
        emoji: '🇲🇻',
    },
    {
        name: 'Malawi',
        code: 'MW',
        emoji: '🇲🇼',
    },
    {
        name: 'Mexico',
        code: 'MX',
        emoji: '🇲🇽',
    },
    {
        name: 'Malaysia',
        code: 'MY',
        emoji: '🇲🇾',
    },
    {
        name: 'Mozambique',
        code: 'MZ',
        emoji: '🇲🇿',
    },
    {
        name: 'Namibia',
        code: 'NA',
        emoji: '🇳🇦',
    },
    {
        name: 'New Caledonia',
        code: 'NC',
        emoji: '🇳🇨',
    },
    {
        name: 'Niger',
        code: 'NE',
        emoji: '🇳🇪',
    },
    {
        name: 'Norfolk Island',
        code: 'NF',
        emoji: '🇳🇫',
    },
    {
        name: 'Nigeria',
        code: 'NG',
        emoji: '🇳🇬',
    },
    {
        name: 'Nicaragua',
        code: 'NI',
        emoji: '🇳🇮',
    },
    {
        name: 'Netherlands',
        code: 'NL',
        emoji: '🇳🇱',
    },
    {
        name: 'Norway',
        code: 'NO',
        emoji: '🇳🇴',
    },
    {
        name: 'Nepal',
        code: 'NP',
        emoji: '🇳🇵',
    },
    {
        name: 'Nauru',
        code: 'NR',
        emoji: '🇳🇷',
    },
    {
        name: 'Niue',
        code: 'NU',
        emoji: '🇳🇺',
    },
    {
        name: 'New Zealand',
        code: 'NZ',
        emoji: '🇳🇿',
    },
    {
        name: 'Oman',
        code: 'OM',
        emoji: '🇴🇲',
    },
    {
        name: 'Panama',
        code: 'PA',
        emoji: '🇵🇦',
    },
    {
        name: 'Peru',
        code: 'PE',
        emoji: '🇵🇪',
    },
    {
        name: 'French Polynesia',
        code: 'PF',
        emoji: '🇵🇫',
    },
    {
        name: 'Papua New Guinea',
        code: 'PG',
        emoji: '🇵🇬',
    },
    {
        name: 'Philippines',
        code: 'PH',
        emoji: '🇵🇭',
    },
    {
        name: 'Pakistan',
        code: 'PK',
        emoji: '🇵🇰',
    },
    {
        name: 'Poland',
        code: 'PL',
        emoji: '🇵🇱',
    },
    {
        name: 'St. Pierre & Miquelon',
        code: 'PM',
        emoji: '🇵🇲',
    },
    {
        name: 'Pitcairn Islands',
        code: 'PN',
        emoji: '🇵🇳',
    },
    {
        name: 'Puerto Rico',
        code: 'PR',
        emoji: '🇵🇷',
    },
    {
        name: 'Palestinian Territories',
        code: 'PS',
        emoji: '🇵🇸',
    },
    {
        name: 'Portugal',
        code: 'PT',
        emoji: '🇵🇹',
    },
    {
        name: 'Palau',
        code: 'PW',
        emoji: '🇵🇼',
    },
    {
        name: 'Paraguay',
        code: 'PY',
        emoji: '🇵🇾',
    },
    {
        name: 'Qatar',
        code: 'QA',
        emoji: '🇶🇦',
    },
    {
        name: 'Réunion',
        code: 'RE',
        emoji: '🇷🇪',
    },
    {
        name: 'Romania',
        code: 'RO',
        emoji: '🇷🇴',
    },
    {
        name: 'Serbia',
        code: 'RS',
        emoji: '🇷🇸',
    },
    {
        name: 'Russia',
        code: 'RU',
        emoji: '🇷🇺',
    },
    {
        name: 'Rwanda',
        code: 'RW',
        emoji: '🇷🇼',
    },
    {
        name: 'Saudi Arabia',
        code: 'SA',
        emoji: '🇸🇦',
    },
    {
        name: 'Solomon Islands',
        code: 'SB',
        emoji: '🇸🇧',
    },
    {
        name: 'Seychelles',
        code: 'SC',
        emoji: '🇸🇨',
    },
    {
        name: 'Sudan',
        code: 'SD',
        emoji: '🇸🇩',
    },
    {
        name: 'Sweden',
        code: 'SE',
        emoji: '🇸🇪',
    },
    {
        name: 'Singapore',
        code: 'SG',
        emoji: '🇸🇬',
    },
    {
        name: 'St. Helena',
        code: 'SH',
        emoji: '🇸🇭',
    },
    {
        name: 'Slovenia',
        code: 'SI',
        emoji: '🇸🇮',
    },
    {
        name: 'Svalbard & Jan Mayen',
        code: 'SJ',
        emoji: '🇸🇯',
    },
    {
        name: 'Slovakia',
        code: 'SK',
        emoji: '🇸🇰',
    },
    {
        name: 'Sierra Leone',
        code: 'SL',
        emoji: '🇸🇱',
    },
    {
        name: 'San Marino',
        code: 'SM',
        emoji: '🇸🇲',
    },
    {
        name: 'Senegal',
        code: 'SN',
        emoji: '🇸🇳',
    },
    {
        name: 'Somalia',
        code: 'SO',
        emoji: '🇸🇴',
    },
    {
        name: 'Suriname',
        code: 'SR',
        emoji: '🇸🇷',
    },
    {
        name: 'South Sudan',
        code: 'SS',
        emoji: '🇸🇸',
    },
    {
        name: 'São Tomé & Príncipe',
        code: 'ST',
        emoji: '🇸🇹',
    },
    {
        name: 'El Salvador',
        code: 'SV',
        emoji: '🇸🇻',
    },
    {
        name: 'Sint Maarten',
        code: 'SX',
        emoji: '🇸🇽',
    },
    {
        name: 'Syria',
        code: 'SY',
        emoji: '🇸🇾',
    },
    {
        name: 'Eswatini',
        code: 'SZ',
        emoji: '🇸🇿',
    },
    {
        name: 'Tristan da Cunha',
        code: 'TA',
        emoji: '🇹🇦',
    },
    {
        name: 'Turks & Caicos Islands',
        code: 'TC',
        emoji: '🇹🇨',
    },
    {
        name: 'Chad',
        code: 'TD',
        emoji: '🇹🇩',
    },
    {
        name: 'French Southern Territories',
        code: 'TF',
        emoji: '🇹🇫',
    },
    {
        name: 'Togo',
        code: 'TG',
        emoji: '🇹🇬',
    },
    {
        name: 'Thailand',
        code: 'TH',
        emoji: '🇹🇭',
    },
    {
        name: 'Tajikistan',
        code: 'TJ',
        emoji: '🇹🇯',
    },
    {
        name: 'Tokelau',
        code: 'TK',
        emoji: '🇹🇰',
    },
    {
        name: 'Timor-Leste',
        code: 'TL',
        emoji: '🇹🇱',
    },
    {
        name: 'Turkmenistan',
        code: 'TM',
        emoji: '🇹🇲',
    },
    {
        name: 'Tunisia',
        code: 'TN',
        emoji: '🇹🇳',
    },
    {
        name: 'Tonga',
        code: 'TO',
        emoji: '🇹🇴',
    },
    {
        name: 'Turkey',
        code: 'TR',
        emoji: '🇹🇷',
    },
    {
        name: 'Trinidad & Tobago',
        code: 'TT',
        emoji: '🇹🇹',
    },
    {
        name: 'Tuvalu',
        code: 'TV',
        emoji: '🇹🇻',
    },
    {
        name: 'Taiwan',
        code: 'TW',
        emoji: '🇹🇼',
    },
    {
        name: 'Tanzania',
        code: 'TZ',
        emoji: '🇹🇿',
    },
    {
        name: 'Ukraine',
        code: 'UA',
        emoji: '🇺🇦',
    },
    {
        name: 'Uganda',
        code: 'UG',
        emoji: '🇺🇬',
    },
    {
        name: 'U.S. Outlying Islands',
        code: 'UM',
        emoji: '🇺🇲',
    },
    {
        name: 'United Nations',
        code: 'UN',
        emoji: '🇺🇳',
    },
    {
        name: 'United States',
        code: 'US',
        emoji: '🇺🇸',
    },
    {
        name: 'Uruguay',
        code: 'UY',
        emoji: '🇺🇾',
    },
    {
        name: 'Uzbekistan',
        code: 'UZ',
        emoji: '🇺🇿',
    },
    {
        name: 'Vatican City',
        code: 'VA',
        emoji: '🇻🇦',
    },
    {
        name: 'St. Vincent & Grenadines',
        code: 'VC',
        emoji: '🇻🇨',
    },
    {
        name: 'Venezuela',
        code: 'VE',
        emoji: '🇻🇪',
    },
    {
        name: 'British Virgin Islands',
        code: 'VG',
        emoji: '🇻🇬',
    },
    {
        name: 'U.S. Virgin Islands',
        code: 'VI',
        emoji: '🇻🇮',
    },
    {
        name: 'Vietnam',
        code: 'VN',
        emoji: '🇻🇳',
    },
    {
        name: 'Vanuatu',
        code: 'VU',
        emoji: '🇻🇺',
    },
    {
        name: 'Wallis & Futuna',
        code: 'WF',
        emoji: '🇼🇫',
    },
    {
        name: 'Samoa',
        code: 'WS',
        emoji: '🇼🇸',
    },
    {
        name: 'Kosovo',
        code: 'XK',
        emoji: '🇽🇰',
    },
    {
        name: 'Yemen',
        code: 'YE',
        emoji: '🇾🇪',
    },
    {
        name: 'Mayotte',
        code: 'YT',
        emoji: '🇾🇹',
    },
    {
        name: 'South Africa',
        code: 'ZA',
        emoji: '🇿🇦',
    },
    {
        name: 'Zambia',
        code: 'ZM',
        emoji: '🇿🇲',
    },
    {
        name: 'Zimbabwe',
        code: 'ZW',
        emoji: '🇿🇼',
    },
    {
        name: 'England',
        code: 'ENGLAND',
        emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    },
    {
        name: 'Scotland',
        code: 'SCOTLAND',
        emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    },
    {
        name: 'Wales',
        code: 'WALES',
        emoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    },
].map((country, index) => ({
    ...country,
    id: index,
}));

export { countries };
