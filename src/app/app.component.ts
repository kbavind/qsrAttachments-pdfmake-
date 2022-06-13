import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'qsr_attach2';
  contentDef: any;
  contentDefinition: any;
  data = {
    "body": [
      {
        "data": {
          "notes": "Please keep the treatment area clear of all items before servicing.\nTechnician may need additional 15 minutes travel time due to unforeseen bad traffic.\nAppointment falls on public holidays will be reschedule to next working day.\nRequest for reschedule is available if the weather condition is bad."
        },
        "servicinglines": [
          {
            "sched": {
              "targets": [
                {
                  "account": {
                    "id": "HcPspppmS8Kn1dFnY6fjQA",
                    "code": "ANTS",
                    "name": "Ants"
                  },
                  "natures": [
                    {
                      "id": "AAACBwAAQACAAAAAAAAAAg",
                      "abbr": null,
                      "code": "follow-up",
                      "name": "Follow Up"
                    },
                    {
                      "id": "AAACBwAAQACAAAAAAAAABQ",
                      "abbr": null,
                      "code": "fogging",
                      "name": "Fogging"
                    },
                    {
                      "id": "AAACBwAAQACAAAAAAAAABg",
                      "abbr": null,
                      "code": "dusting",
                      "name": "Dusting"
                    }
                  ]
                },
                {
                  "account": {
                    "id": "Wq6TvfmnSNeJ2Ab9Wzq88g",
                    "code": "ROACHES",
                    "name": "Cockroaches"
                  },
                  "natures": [
                    {
                      "id": "PYf6ewBVTi2cNGxBMbP58A",
                      "code": "SSP",
                      "name": "Surface spray"
                    }
                  ]
                },
                {
                  "account": {
                    "id": "saXcTyOmQ6WmAYDC3jmktQ",
                    "code": "RODENTS",
                    "name": "Rodents"
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  }

  constructor(private router: Router) { }
  ngOnInit(): void {
  }


  getTableContent1() {
    const pdfBody: any = [
      [{ text: 'PEST' }, { text: 'TREATMENT' }]
    ]

    this.data.body[0].servicinglines[0].sched.targets.map(d => {
      const account = d[`account`] && d[`account`].name || ''
        , natures = d[`natures`] && d[`natures`].length ? d[`natures`] : []

      const pdfmakeContent = [{ rowSpan: natures?.length || 0, text: account }, { text: natures?.length ? natures[0]?.name : '' }]

      pdfBody.push(pdfmakeContent)
      natures.map((n, index) => {
        if (index >= 1) {
          pdfBody.push([{ text: '' }, { text: n.name }])
        }
      })

    })

    const notes = this.data.body[0].data.notes.split("\n")
    notes.map((d, index) => {
      let borderbottom = false
      if (index + 1 == notes.length) {
        borderbottom = true;
      }
      pdfBody.push([{ border: [true, false, true, borderbottom], text: index + 1 + ") " + d, colSpan: 2 }, { text: '' }])
    })
    console.log(pdfBody)
    return pdfBody
  }

  getpdfContent1() {
    this.contentDef = {
      pageOrientation: 'landscape',
      content: [
        {
          text: 'REQUIREMENTS',
          fontSize: 9,
          decoration: 'underline'
        },
        { text: '\n' },
        {
          text: 'MONTHLY TREATMENT (COMPULSORY)',
          fontSize: 9,
          decoration: 'underline'
        },
        { text: '\n' },
        {
          style: 'table1',
          table: {
            fontSize: 9,
            widths: ['20%', '80%'],
            borderColor: ['#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c'],
            body: this.getTableContent1()
          },
          layout: {
            hLineWidth: function (i: number, node: { table: { body: string | any[]; }; }) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i: number, node: { table: { widths: string | any[]; }; }) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i: number, node: { table: { body: string | any[]; }; }) {
              return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
            },
            vLineColor: function (i: number, node: { table: { widths: string | any[]; }; }) {
              return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
            },
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        },
        { text: '\nADDITIONAL TREATMENTS / SERVICES (WHEN REQUESTED)\n', style: 'subheader1' },
        '\n',
        {
          style: 'table2',
          table: {
            widths: ['20%', '80%'],
            body: [
              [{ text: 'PEST' }, { text: 'TREATMENT/SERVICES' }],
              [{ rowSpan: 4, text: 'COCKROACH / ANTS' }, { text: 'ADDITIONAL RESIDUAL SPRAYING' }],
              [{ text: '' }, { text: 'ADDITIONAL GEL BAITING' }],
              [{ text: '' }, { text: 'ULV MISTING-INTERIOR' }],
              [{ text: '' }, { text: 'FOAMING FOR DRAIN & SEWERAGE' }],
              [{ rowSpan: 2, text: 'RODENT' }, { text: 'ADDITIONAL GLUE BOARD' }],
              [{ text: '' }, { text: 'EXTERIOR BAIT STATION' }],
              [{ rowSpan: 4, text: 'FLIES' }, { text: 'Q-BAYT SPRAYING-EXTERIOR' }],
              [{ text: '' }, { text: 'THERMAL FOGGING-EXTERIOR' }],
              [{ text: '' }, { text: 'ULV MISTING-INTERIOR' }],
              [{ text: '' }, { text: 'FOAMING FOR DRAIN & SEWERAGE' }],
              [{ text: 'TERMITES' }, { text: '' }],
              [{ text: 'OTHER PEST (BIRD / LIZARD / BAT)' }, { text: '' }],
              [{ text: 'RODENT / BAT' }, { text: 'ODOUR REMOVAL' }],
              [{ text: 'OTHER SERVICES' }, { text: 'INSPECTION-TO PROVIDE SUGGESTION ON TREATMENT & PROOFING' }],
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: { table: { body: string | any[]; }; }) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i: number, node: { table: { widths: string | any[]; }; }) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i: number, node: { table: { body: string | any[]; }; }) {
              return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
            },
            vLineColor: function (i: number, node: { table: { widths: string | any[]; }; }) {
              return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
            },
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        }
      ],
      styles: {
        table1: {
          borderColor: ['#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c'],
          fontSize: 9,
          alignment: 'left'
        },
        table2: {
          borderColor: ['#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c'],
          fontSize: 9,
          alignment: 'left'
        },
        subheader: {
          fontSize: 8,
        },
        subheader1: {
          fontSize: 9,
          decoration: 'underline'
        }
      }
    };
    console.log(this.contentDef)
    return this.contentDef;
  }

  generatePdf() {
    console.log("Exporting to PDF...");
    this.contentDef = this.getpdfContent1();
    pdfMake.createPdf(this.contentDef).open();
  }

  getPdfContent2() {
    this.contentDefinition = {
      content: [
        {
          text: 'ADDITIONAL TREATMENTS / SERVICES (WHEN REQUESTED)',
          fontSize: 9,
          decoration: 'underline',
          bold: 'true'
        },
        {text: '\n'},
        {text: '1.Bidders to provide proposed price according to UOM', fontSize: 8},
        {text: '2.If the price is different depending on size of outlet,please provide the price and specify the details', fontSize: 8},
        {text: '\n'},
        {
          style: 'tableRemarks',
          table: {
            widths: ['22%', '25%', '15%', '23%', '15%'],
            body: [
              [{text: 'PEST', style: 'tableHeader'}, {text: 'TREATMENT/SERVICES', style: 'tableHeader'}, {text: 'UOM', style: 'tableHeader'}, {text: 'PRICE', style: 'tableHeader'}, {text: 'REMARKS', style: 'tableHeader'}],
              [{text: 'COCKROACH / ANTS', rowSpan: 4}, {text: 'ADDTIONAL RESIDUAL SPRAYING'}, {text: 'SERVICE'}, {text: 'RM48.00'}, {text: 'Revised'}],
              [{text: ''}, {text: 'ADDITIONAL GEL BAITING'}, {text: 'SERVICE'}, {text: 'RM48.00'}, {text: 'Revised'}],
              [{text: ''}, {text: 'ULV MISTING-INTERIOR'}, {text: 'SERVICE'}, {text: 'RM160.00'}, {text: 'Revised'}],
              [{text: ''}, {text: 'FOAMING FOR DRAIN & SEWERAGE'}, {text: 'SERVICE'}, {text: 'RM20.00 per service for minimum 2 kitchen/toilet drain holes, RM50 per service for 1 drain / sewerage hole'}, {text: ''}],
              [{text: 'RODENT', rowSpan: 2}, {text: 'ADDITIONAL GLUE BOARD'}, {text: 'UNIT'}, {text: 'RM5.00 per unit'}, {text: ''}],
              [{text: ''}, {text: 'EXTERIOR BAIT STATION (RENT/SELL)(EMPTY/GOT THINGS INSIDE)'}, {text: 'UNIT'}, {text: 'RM10.00 per service per unit per month (RM25.00 /unit if damaged or missing, consider sold)'}, {text: ''}],          
              [{text: 'FLIES', rowSpan: 4}, {text: 'Q-BAYT SPRAYING-EXTERIOR'}, {text: 'SERVICE'}, {text: 'RM80.00 per service'}, {text: ''}],
              [{text: ''}, {text: 'THERMAL FOGGING-EXTERIOR'}, {text: 'SERVICE'}, {text: 'RM200.00 per service'}, {text: ''}],
              [{text: ''}, {text: 'ULV MISTING-INTERIOR'}, {text: 'SERVICE'}, {text: 'RM180.00 per service'}, {text: ''}],
              [{text: ''}, {text: 'FOAMING FOR DRAIN & SEWERAGE '}, {text: 'SERVICE'}, {text: 'RM20.00 per service for minimum 2 kitchen/toilet drain holes, RM50 per service for 1 drain / sewerage hole'}, {text: ''}],
              [{text: 'TERMITES'}, {text: 'AS RECOMMENDED BY VENDOR'}, {text: 'SERVICE'}, {text: 'RM1,000.00 for 1 unit of Above Ground (AG) bait station'}, {text: ''}],
              [{text: 'OTHER SERVICES'}, {text: 'INSPECTION-TO PROVIDE SUGGESTION ON TREATMENT & PROOFING'}, {text: 'SERVICE'}, {text: 'RM150.00 per hour per inspection report'}, {text: 'Inspection being carried out by field biologist'}],
              [{text: 'OTHER PEST (BIRD / LIZARD / BAT) SERVICE', rowSpan: 3}, {text: 'BIRD'}, {text: 'SERVICE/SQFT '}, {text: 'Subject to further survey and separate proposal'}, {text: ''}],
              [{text: ''}, {text: 'LIZARD'}, {text: 'SERVICE/SQFT'}, {text: 'Subject to further survey and separate proposal'}, {text: ''}],
              [{text: ''}, {text: 'BAT'}, {text: 'SERVICE/SQFT'}, {text: 'Subject to further survey and separate proposal'}, {text: ''}],
              [{text: 'RODENT'}, {text: 'ODOUR REMOVAL'}, {text: 'UNIT'}, {text: 'RM100.00 per service for rodent, Rodent'}, {text: ''}],
              [{text: 'BAT'}, {text: 'ODOUR REMOVAL'}, {text: 'UNIT'}, {text: 'RM200 per service for Bat'}, {text: ''}],
              [{text: 'SANITIZATION(DISINFECTANT SERVICE)'}, {text: ''}, {text: 'SERVICE/SQFT'}, {text: 'RM0.10 per sq ft or minimum charges RM450.00 which ever is higher'}, {text: ''}],
              [{text: 'ADDITIONAL REPORT (REQUIRED FIELD BIOLOGIST - OTHER MONTHLY REPORT)'}, {text: ''}, {text: 'SERVICE/REPORT'}, {text: 'RM150.00 per hour per inspection report'}, {text: ''}],
              [{text: 'OTHER ADDITIONAL SERVICE/UNIT FEE (That not listed on the above)'}, {text: 'TRAVELLING CHARGE'}, {text: ''}, {text: 'RM100.00 per trip will be imposed for the above additional services'}, {text: ''}],
            ]
          },
          layout: {
            hLineWidth: function (i: number, node: { table: { body: string | any[]; }; }) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i: number, node: { table: { widths: string | any[]; }; }) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i: number, node: { table: { body: string | any[]; }; }) {
              return (i === 0 || i === node.table.body.length) ? 'gray' : 'gray';
            },
            vLineColor: function (i: number, node: { table: { widths: string | any[]; }; }) {
              return (i === 0 || i === node.table.widths.length) ? 'gray' : 'gray';
            },
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          },
        }
      ],
      styles: {
        tableRemarks: {
          borderColor: ['#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c'],
          fontSize: 9,
          alignment: 'left'
        },
        tableHeader: {
          bold: true,
          alignment: 'center'
        }
      }
    }
    console.log(this.contentDefinition)
    return this.contentDefinition
  }

  generatePDF2() {
    console.log("Exporting to PDF...");
    this.contentDefinition = this.getPdfContent2();
    pdfMake.createPdf(this.contentDefinition).open();
  }

}
