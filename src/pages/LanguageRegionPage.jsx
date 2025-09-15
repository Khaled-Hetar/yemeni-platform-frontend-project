import React from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { FiGlobe, FiClock, FiSave } from 'react-icons/fi';

const LanguageRegionPage = () => {
  return (
    <SettingsLayout title="اللغة والمنطقة" description="اختر لغة العرض والمنطقة الزمنية التي تناسبك.">
      <div className="space-y-6">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">لغة الواجهة</label>
          <div className="relative">
            <FiGlobe className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <select id="language" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">المنطقة الزمنية</label>
          <div className="relative">
            <FiClock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <select
              id="timezone"
              name="timezone"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none">
              <option value="" disabled selected>اختر منطقتك الزمنية...</option>
  
              <optgroup label="أفريقيا">
                <option value="Africa/Abidjan">(GMT+00:00) أبيدجان</option>
                <option value="Africa/Accra">(GMT+00:00) أكرا</option>
                <option value="Africa/Algiers">(GMT+01:00) الجزائر</option>
                <option value="Africa/Bissau">(GMT+00:00) بيساو</option>
                <option value="Africa/Cairo">(GMT+02:00) القاهرة</option>
                <option value="Africa/Casablanca">(GMT+01:00) الدار البيضاء</option>
                <option value="Africa/Ceuta">(GMT+02:00) سبتة</option>
                <option value="Africa/El_Aaiun">(GMT+01:00) العيون</option>
                <option value="Africa/Johannesburg">(GMT+02:00) جوهانسبرغ</option>
                <option value="Africa/Juba">(GMT+02:00) جوبا</option>
                <option value="Africa/Khartoum">(GMT+02:00) الخرطوم</option>
                <option value="Africa/Lagos">(GMT+01:00) لاغوس</option>
                <option value="Africa/Maputo">(GMT+02:00) مابوتو</option>
                <option value="Africa/Monrovia">(GMT+00:00) مونروفيا</option>
                <option value="Africa/Nairobi">(GMT+03:00) نيروبي</option>
                <option value="Africa/Ndjamena">(GMT+01:00) انجمينا</option>
                <option value="Africa/Sao_Tome">(GMT+00:00) ساو تومي</option>
                <option value="Africa/Tripoli">(GMT+02:00) طرابلس</option>
                <option value="Africa/Tunis">(GMT+01:00) تونس</option>
                <option value="Africa/Windhoek">(GMT+02:00) ويندهوك</option>
              </optgroup>

              <optgroup label="أمريكا">
                <option value="America/Adak">(GMT-09:00) أداك</option>
                <option value="America/Anchorage">(GMT-08:00) أنكوراج</option>
                <option value="America/Asuncion">(GMT-04:00) أسونسيون</option>
                <option value="America/Atikokan">(GMT-05:00) أتيكوكان</option>
                <option value="America/Bogota">(GMT-05:00) بوغوتا</option>
                <option value="America/Boise">(GMT-06:00) بويز</option>
                <option value="America/Buenos_Aires">(GMT-03:00) بوينس آيرس</option>
                <option value="America/Cancun">(GMT-05:00) كانكون</option>
                <option value="America/Caracas">(GMT-04:00) كاراكاس</option>
                <option value="America/Chicago">(GMT-05:00) شيكاغو</option>
                <option value="America/Chihuahua">(GMT-06:00) شيواوا</option>
                <option value="America/Costa_Rica">(GMT-06:00) كوستاريكا</option>
                <option value="America/Denver">(GMT-06:00) دنفر</option>
                <option value="America/Detroit">(GMT-04:00) ديترويت</option>
                <option value="America/Edmonton">(GMT-06:00) إدمونتون</option>
                <option value="America/El_Salvador">(GMT-06:00) السلفادور</option>
                <option value="America/Guatemala">(GMT-06:00) غواتيمالا</option>
                <option value="America/Guayaquil">(GMT-05:00) غواياكيل</option>
                <option value="America/Guyana">(GMT-04:00) غيانا</option>
                <option value="America/Halifax">(GMT-03:00) هاليفاكس</option>
                <option value="America/Havana">(GMT-04:00) هافانا</option>
                <option value="America/Indiana/Indianapolis">(GMT-04:00) إنديانابوليس</option>
                <option value="America/Jamaica">(GMT-05:00) جامايكا</option>
                <option value="America/La_Paz">(GMT-04:00) لاباز</option>
                <option value="America/Lima">(GMT-05:00) ليما</option>
                <option value="America/Los_Angeles">(GMT-07:00) لوس أنجلوس</option>
                <option value="America/Managua">(GMT-06:00) ماناغوا</option>
                <option value="America/Manaus">(GMT-04:00) ماناوس</option>
                <option value="America/Mexico_City">(GMT-06:00) مكسيكو سيتي</option>
                <option value="America/Montevideo">(GMT-03:00) مونتيفيديو</option>
                <option value="America/New_York">(GMT-04:00) نيويورك</option>
                <option value="America/Panama">(GMT-05:00) بنما</option>
                <option value="America/Phoenix">(GMT-07:00) فينيكس</option>
                <option value="America/Port-au-Prince">(GMT-04:00) بورت أو برانس</option>
                <option value="America/Puerto_Rico">(GMT-04:00) بورتوريكو</option>
                <option value="America/Regina">(GMT-06:00) ريجاينا</option>
                <option value="America/Santiago">(GMT-04:00) سانتياغو</option>
                <option value="America/Sao_Paulo">(GMT-03:00) ساو باولو</option>
                <option value="America/St_Johns">(GMT-02:30) سانت جونز</option>
                <option value="America/Tegucigalpa">(GMT-06:00) تيجوسيجالبا</option>
                <option value="America/Toronto">(GMT-04:00) تورونتو</option>
                <option value="America/Vancouver">(GMT-07:00) فانكوفر</option>
                <option value="America/Winnipeg">(GMT-05:00) وينيبيغ</option>
              </optgroup>

              <optgroup label="آسيا">
                <option value="Asia/Aden">(GMT+03:00) عدن</option>
                <option value="Asia/Amman">(GMT+03:00) عمّان</option>
                <option value="Asia/Anadyr">(GMT+12:00) أنادير</option>
                <option value="Asia/Aqtau">(GMT+05:00) أكتاو</option>
                <option value="Asia/Aqtobe">(GMT+05:00) أكتوبي</option>
                <option value="Asia/Ashgabat">(GMT+05:00) عشق أباد</option>
                <option value="Asia/Atyrau">(GMT+05:00) أتيراو</option>
                <option value="Asia/Baghdad">(GMT+03:00) بغداد</option>
                <option value="Asia/Bahrain">(GMT+03:00) البحرين</option>
                <option value="Asia/Baku">(GMT+04:00) باكو</option>
                <option value="Asia/Bangkok">(GMT+07:00) بانكوك</option>
                <option value="Asia/Barnaul">(GMT+07:00) بارناول</option>
                <option value="Asia/Beirut">(GMT+03:00) بيروت</option>
                <option value="Asia/Bishkek">(GMT+06:00) بيشكيك</option>
                <option value="Asia/Brunei">(GMT+08:00) بروناي</option>
                <option value="Asia/Chita">(GMT+09:00) تشيتا</option>
                <option value="Asia/Choibalsan">(GMT+08:00) تشويبالسان</option>
                <option value="Asia/Colombo">(GMT+05:30) كولومبو</option>
                <option value="Asia/Damascus">(GMT+03:00) دمشق</option>
                <option value="Asia/Dhaka">(GMT+06:00) دكا</option>
                <option value="Asia/Dili">(GMT+09:00) ديلي</option>
                <option value="Asia/Dubai">(GMT+04:00) دبي</option>
                <option value="Asia/Dushanbe">(GMT+05:00) دوشنبه</option>
                <option value="Asia/Famagusta">(GMT+03:00) فاماغوستا</option>
                <option value="Asia/Gaza">(GMT+03:00) غزة</option>
                <option value="Asia/Hebron">(GMT+03:00) الخليل</option>
                <option value="Asia/Ho_Chi_Minh">(GMT+07:00) هو تشي منه</option>
                <option value="Asia/Hong_Kong">(GMT+08:00) هونغ كونغ</option>
                <option value="Asia/Hovd">(GMT+07:00) خوفد</option>
                <option value="Asia/Irkutsk">(GMT+08:00) إيركوتسك</option>
                <option value="Asia/Jakarta">(GMT+07:00) جاكرتا</option>
                <option value="Asia/Jayapura">(GMT+09:00) جايابورا</option>
                <option value="Asia/Jerusalem">(GMT+03:00) القدس</option>
                <option value="Asia/Kabul">(GMT+04:30) كابول</option>
                <option value="Asia/Kamchatka">(GMT+12:00) كامتشاتكا</option>
                <option value="Asia/Karachi">(GMT+05:00) كراتشي</option>
                <option value="Asia/Kathmandu">(GMT+05:45) كاتماندو</option>
                <option value="Asia/Khandyga">(GMT+09:00) خانتيغا</option>
                <option value="Asia/Kolkata">(GMT+05:30) كولكاتا</option>
                <option value="Asia/Krasnoyarsk">(GMT+07:00) كراسنويارسك</option>
                <option value="Asia/Kuala_Lumpur">(GMT+08:00) كوالالمبور</option>
                <option value="Asia/Kuching">(GMT+08:00) كوتشينغ</option>
                <option value="Asia/Kuwait">(GMT+03:00) الكويت</option>
                <option value="Asia/Macau">(GMT+08:00) ماكاو</option>
                <option value="Asia/Magadan">(GMT+11:00) ماجادان</option>
                <option value="Asia/Makassar">(GMT+08:00) ماكاسار</option>
                <option value="Asia/Manila">(GMT+08:00) مانيلا</option>
                <option value="Asia/Muscat">(GMT+04:00) مسقط</option>
                <option value="Asia/Nicosia">(GMT+03:00) نيقوسيا</option>
                <option value="Asia/Novokuznetsk">(GMT+07:00) نوفوكوزنتسك</option>
                <option value="Asia/Novosibirsk">(GMT+07:00) نوفوسيبيرسك</option>
                <option value="Asia/Omsk">(GMT+06:00) أومسك</option>
                <option value="Asia/Oral">(GMT+05:00) أورال</option>
                <option value="Asia/Phnom_Penh">(GMT+07:00) بنوم بنه</option>
                <option value="Asia/Pontianak">(GMT+07:00) بونتياناك</option>
                <option value="Asia/Pyongyang">(GMT+09:00) بيونغ يانغ</option>
                <option value="Asia/Qatar">(GMT+03:00) قطر</option>
                <option value="Asia/Qostanay">(GMT+06:00) كوستاناي</option>
                <option value="Asia/Qyzylorda">(GMT+05:00) كيزيلوردا</option>
                <option value="Asia/Riyadh">(GMT+03:00) الرياض</option>
                <option value="Asia/Sakhalin">(GMT+11:00) سخالين</option>
                <option value="Asia/Samarkand">(GMT+05:00) سمرقند</option>
                <option value="Asia/Seoul">(GMT+09:00) سيول</option>
                <option value="Asia/Shanghai">(GMT+08:00) شنغهاي</option>
                <option value="Asia/Singapore">(GMT+08:00) سنغافورة</option>
                <option value="Asia/Srednekolymsk">(GMT+11:00) سريدنكوليمسك</option>
                <option value="Asia/Taipei">(GMT+08:00) تايبيه</option>
                <option value="Asia/Tashkent">(GMT+05:00) طشقند</option>
                <option value="Asia/Tbilisi">(GMT+04:00) تبليسي</option>
                <option value="Asia/Tehran">(GMT+03:30) طهران</option>
                <option value="Asia/Thimphu">(GMT+06:00) تيمفو</option>
                <option value="Asia/Tokyo">(GMT+09:00) طوكيو</option>
                <option value="Asia/Tomsk">(GMT+07:00) تومسك</option>
                <option value="Asia/Ulaanbaatar">(GMT+08:00) أولان باتور</option>
                <option value="Asia/Urumqi">(GMT+06:00) أورومتشي</option>
                <option value="Asia/Ust-Nera">(GMT+10:00) أوست-نيرا</option>
                <option value="Asia/Vientiane">(GMT+07:00) فيينتيان</option>
                <option value="Asia/Vladivostok">(GMT+10:00) فلاديفوستوك</option>
                <option value="Asia/Yakutsk">(GMT+09:00) ياكوتسك</option>
                <option value="Asia/Yangon">(GMT+06:30) يانغون</option>
                <option value="Asia/Yekaterinburg">(GMT+05:00) يكاترينبورغ</option>
                <option value="Asia/Yerevan">(GMT+04:00) يريفان</option>
              </optgroup>

              <optgroup label="أوروبا">
                <option value="Europe/Amsterdam">(GMT+02:00) أمستردام</option>
                <option value="Europe/Andorra">(GMT+02:00) أندورا</option>
                <option value="Europe/Astrakhan">(GMT+04:00) أستراخان</option>
                <option value="Europe/Athens">(GMT+03:00) أثينا</option>
                <option value="Europe/Belgrade">(GMT+02:00) بلغراد</option>
                <option value="Europe/Berlin">(GMT+02:00) برلين</option>
                <option value="Europe/Bratislava">(GMT+02:00) براتيسلافا</option>
                <option value="Europe/Brussels">(GMT+02:00) بروكسل</option>
                <option value="Europe/Bucharest">(GMT+03:00) بوخارست</option>
                <option value="Europe/Budapest">(GMT+02:00) بودابست</option>
                <option value="Europe/Busingen">(GMT+02:00) بوسينغن</option>
                <option value="Europe/Chisinau">(GMT+03:00) كيشيناو</option>
                <option value="Europe/Copenhagen">(GMT+02:00) كوبنهاغن</option>
                <option value="Europe/Dublin">(GMT+01:00) دبلن</option>
                <option value="Europe/Gibraltar">(GMT+02:00) جبل طارق</option>
                <option value="Europe/Guernsey">(GMT+01:00) غيرنزي</option>
                <option value="Europe/Helsinki">(GMT+03:00) هلسنكي</option>
                <option value="Europe/Isle_of_Man">(GMT+01:00) جزيرة مان</option>
                <option value="Europe/Istanbul">(GMT+03:00) اسطنبول</option>
                <option value="Europe/Jersey">(GMT+01:00) جيرزي</option>
                <option value="Europe/Kaliningrad">(GMT+02:00) كالينينغراد</option>
                <option value="Europe/Kiev">(GMT+03:00) كييف</option>
                <option value="Europe/Kirov">(GMT+03:00) كيروف</option>
                <option value="Europe/Lisbon">(GMT+01:00) لشبونة</option>
                <option value="Europe/Ljubljana">(GMT+02:00) ليوبليانا</option>
                <option value="Europe/London">(GMT+01:00) لندن</option>
                <option value="Europe/Luxembourg">(GMT+02:00) لوكسمبورغ</option>
                <option value="Europe/Madrid">(GMT+02:00) مدريد</option>
                <option value="Europe/Malta">(GMT+02:00) مالطا</option>
                <option value="Europe/Mariehamn">(GMT+03:00) ماريهامن</option>
                <option value="Europe/Minsk">(GMT+03:00) مينسك</option>
                <option value="Europe/Monaco">(GMT+02:00) موناكو</option>
                <option value="Europe/Moscow">(GMT+03:00) موسكو</option>
                <option value="Europe/Oslo">(GMT+02:00) أوسلو</option>
                <option value="Europe/Paris">(GMT+02:00) باريس</option>
                <option value="Europe/Podgorica">(GMT+02:00) بودغوريتشا</option>
                <option value="Europe/Prague">(GMT+02:00) براغ</option>
                <option value="Europe/Riga">(GMT+03:00) ريغا</option>
                <option value="Europe/Rome">(GMT+02:00) روما</option>
                <option value="Europe/Samara">(GMT+04:00) سمارا</option>
                <option value="Europe/San_Marino">(GMT+02:00) سان مارينو</option>
                <option value="Europe/Sarajevo">(GMT+02:00) سراييفو</option>
                <option value="Europe/Saratov">(GMT+04:00) ساراتوف</option>
                <option value="Europe/Simferopol">(GMT+03:00) سيمفيروبول</option>
                <option value="Europe/Skopje">(GMT+02:00) سكوبيه</option>
                <option value="Europe/Sofia">(GMT+03:00) صوفيا</option>
                <option value="Europe/Stockholm">(GMT+02:00) ستوكهولم</option>
                <option value="Europe/Tallinn">(GMT+03:00) تالين</option>
                <option value="Europe/Tirane">(GMT+02:00) تيرانا</option>
                <option value="Europe/Ulyanovsk">(GMT+04:00) أوليانوفسك</option>
                <option value="Europe/Uzhgorod">(GMT+03:00) أوجهورود</option>
                <option value="Europe/Vaduz">(GMT+02:00) فادوز</option>
                <option value="Europe/Vatican">(GMT+02:00) الفاتيكان</option>
                <option value="Europe/Vienna">(GMT+02:00) فيينا</option>
                <option value="Europe/Vilnius">(GMT+03:00) فيلنيوس</option>
                <option value="Europe/Volgograd">(GMT+03:00) فولغوغراد</option>
                <option value="Europe/Warsaw">(GMT+02:00) وارسو</option>
                <option value="Europe/Zagreb">(GMT+02:00) زغرب</option>
                <option value="Europe/Zaporozhye">(GMT+03:00) زاباروجيا</option>
                <option value="Europe/Zurich">(GMT+02:00) زيورخ</option>
              </optgroup>

              <optgroup label="أستراليا">
                <option value="Australia/Adelaide">(GMT+09:30) أديلايد</option>
                <option value="Australia/Brisbane">(GMT+10:00) بريسبان</option>
                <option value="Australia/Broken_Hill">(GMT+09:30) بروكن هيل</option>
                <option value="Australia/Currie">(GMT+10:00) كوري</option>
                <option value="Australia/Darwin">(GMT+09:30) داروين</option>
                <option value="Australia/Eucla">(GMT+08:45) يوкла</option>
                <option value="Australia/Hobart">(GMT+10:00) هوبارت</option>
                <option value="Australia/Lindeman">(GMT+10:00) ليندمان</option>
                <option value="Australia/Lord_Howe">(GMT+10:30) لورد هاو</option>
                <option value="Australia/Melbourne">(GMT+10:00) ملبورن</option>
                <option value="Australia/Perth">(GMT+08:00) بيرث</option>
                <option value="Australia/Sydney">(GMT+10:00) سيدني</option>
              </optgroup>

              <optgroup label="المحيط الأطلسي">
                <option value="Atlantic/Azores">(GMT+00:00) الأزور</option>
                <option value="Atlantic/Bermuda">(GMT-03:00) برمودا</option>
                <option value="Atlantic/Canary">(GMT+01:00) الكناري</option>
                <option value="Atlantic/Cape_Verde">(GMT-01:00) الرأس الأخضر</option>
                <option value="Atlantic/Faroe">(GMT+01:00) فارو</option>
                <option value="Atlantic/Madeira">(GMT+01:00) ماديرا</option>
                <option value="Atlantic/Reykjavik">(GMT+00:00) ريكيافيك</option>
                <option value="Atlantic/South_Georgia">(GMT-02:00) جورجيا الجنوبية</option>
                <option value="Atlantic/Stanley">(GMT-03:00) ستانلي</option>
              </optgroup>

              <optgroup label="المحيط الهادئ">
                <option value="Pacific/Apia">(GMT+13:00) آبيا</option>
                <option value="Pacific/Auckland">(GMT+12:00) أوكلاند</option>
                <option value="Pacific/Bougainville">(GMT+11:00) بوغانفيل</option>
                <option value="Pacific/Chatham">(GMT+12:45) تشاتام</option>
                <option value="Pacific/Chuuk">(GMT+10:00) تشوك</option>
                <option value="Pacific/Easter">(GMT-06:00) جزيرة الفصح</option>
                <option value="Pacific/Efate">(GMT+11:00) إيفات</option>
                <option value="Pacific/Enderbury">(GMT+13:00) إندربوري</option>
                <option value="Pacific/Fakaofo">(GMT+13:00) فاكاوفو</option>
                <option value="Pacific/Fiji">(GMT+12:00) فيجي</option>
                <option value="Pacific/Funafuti">(GMT+12:00) فونافوتي</option>
                <option value="Pacific/Galapagos">(GMT-06:00) غالاباغوس</option>
                <option value="Pacific/Gambier">(GMT-09:00) غامبير</option>
                <option value="Pacific/Guadalcanal">(GMT+11:00) غوادالكانال</option>
                <option value="Pacific/Guam">(GMT+10:00) غوام</option>
                <option value="Pacific/Honolulu">(GMT-10:00) هونولولو</option>
                <option value="Pacific/Kiritimati">(GMT+14:00) كيريتيماتي</option>
                <option value="Pacific/Kosrae">(GMT+11:00) كوسراي</option>
                <option value="Pacific/Kwajalein">(GMT+12:00) كواجالين</option>
                <option value="Pacific/Majuro">(GMT+12:00) ماجورو</option>
                <option value="Pacific/Marquesas">(GMT-09:30) ماركيساس</option>
                <option value="Pacific/Midway">(GMT-11:00) ميدواي</option>
                <option value="Pacific/Nauru">(GMT+12:00) ناورو</option>
                <option value="Pacific/Niue">(GMT-11:00) نييوي</option>
                <option value="Pacific/Norfolk">(GMT+11:00) نورفولك</option>
                <option value="Pacific/Noumea">(GMT+11:00) نوميا</option>
                <option value="Pacific/Pago_Pago">(GMT-11:00) باغو باغو</option>
                <option value="Pacific/Palau">(GMT+09:00) بالاو</option>
                <option value="Pacific/Pitcairn">(GMT-08:00) بيتكيرن</option>
                <option value="Pacific/Pohnpei">(GMT+11:00) بونبي</option>
                <option value="Pacific/Port_Moresby">(GMT+10:00) بورت مورسبي</option>
                <option value="Pacific/Rarotonga">(GMT-10:00) راروتونغا</option>
                <option value="Pacific/Saipan">(GMT+10:00) سايبان</option>
                <option value="Pacific/Tahiti">(GMT-10:00) تاهيتي</option>
                <option value="Pacific/Tarawa">(GMT+12:00) تاراوا</option>
                <option value="Pacific/Tongatapu">(GMT+13:00) تونغاتابو</option>
                <option value="Pacific/Wake">(GMT+12:00) ويك</option>
                <option value="Pacific/Wallis">(GMT+12:00) واليس</option>
              </optgroup>

              <optgroup label="المحيط الهندي">
                <option value="Indian/Antananarivo">(GMT+03:00) أنتاناناريفو</option>
                <option value="Indian/Chagos">(GMT+06:00) تشاغوس</option>
                <option value="Indian/Christmas">(GMT+07:00) جزيرة الكريسماس</option>
                <option value="Indian/Cocos">(GMT+06:30) كوكوس</option>
                <option value="Indian/Comoro">(GMT+03:00) جزر القمر</option>
                <option value="Indian/Kerguelen">(GMT+05:00) كيرغولين</option>
                <option value="Indian/Mahe">(GMT+04:00) ماهي</option>
                <option value="Indian/Maldives">(GMT+05:00) المالديف</option>
                <option value="Indian/Mauritius">(GMT+04:00) موريشيوس</option>
                <option value="Indian/Mayotte">(GMT+03:00) مايوت</option>
                <option value="Indian/Reunion">(GMT+04:00) ريونيون</option>
              </optgroup>

              <optgroup label="أنتاركتيكا">
                <option value="Antarctica/Casey">(GMT+11:00) كيسي</option>
                <option value="Antarctica/Davis">(GMT+07:00) ديفيس</option>
                <option value="Antarctica/DumontDUrville">(GMT+10:00) دومون دو أورفيل</option>
                <option value="Antarctica/Macquarie">(GMT+10:00) ماكواري</option>
                <option value="Antarctica/Mawson">(GMT+05:00) ماوسون</option>
                <option value="Antarctica/McMurdo">(GMT+12:00) ماكموردو</option>
                <option value="Antarctica/Palmer">(GMT-03:00) بالمر</option>
                <option value="Antarctica/Rothera">(GMT-03:00) روثيرا</option>
                <option value="Antarctica/Syowa">(GMT+03:00) سيوا</option>
                <option value="Antarctica/Troll">(GMT+02:00) ترول</option>
                <option value="Antarctica/Vostok">(GMT+05:00) فوستوك</option>
              </optgroup>

              <optgroup label="توقيت عالمي منسق">
                <option value="UTC">(GMT+00:00) توقيت عالمي منسق</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
        <button className="flex items-center justify-center gap-2 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition">
          <FiSave /> حفظ التغييرات
        </button>
      </div>
    </SettingsLayout>
  );
};

export default LanguageRegionPage;
