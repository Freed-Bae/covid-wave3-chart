
const provinces = ["สงขลา", "ปัตตานี", "นราธิวาส"]
const colors = ["#ff6f69", "#1f25aa", "#96ceb4", "#ff8c00", "#da70d6"]
let url = "https://covid19.ddc.moph.go.th/api/Cases/timeline-cases-by-provinces";
const ctx = document.getElementById("covidChart").getContext("2d");
let arrByProvince = []
let myChart
let mDate
let _Province
// const values = Object.values(provinces);
// for (let x in values) {
//     console.log(values[x]);
// }
function filterByProvince(items) {
    if (items.province === _Province) {
        return items;
    }
}

function showChart(ctx, data) {
    // console.log(data);
    var startDate = new Date(mDate);
    let mData = []
    // fill by Date
    provinces.forEach((val, i) => {
        mData.push(data[i].filter(function (item) {
            var txn_date = item.txn_date;
            var date = new Date(txn_date);
            return date >= startDate;
        }))
    })
    let labels = [...new Set(mData[0].map((item) => item.txn_date))];
    // console.log(labels)
    // console.log(mData)
    let datasets = []
    let dataset = {}
    provinces.forEach((val, i) => {
        dataset = {
            label: val,
            data: mData[i].map((item) => item.new_case),
            backgroundColor: colors[i],
            borderColor: colors[i],
        }
        datasets.push(dataset)
    })

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Covid Line Chart",
                },
            },
        },
    });
}
function loadData(datePickerElement, mProvince) {
    mDate = datePickerElement.value
    axios.get(url).then(function (response) {
        let arrData = response.data;
        for (let i in mProvince) {
            // console.log(mProvince[i])
            _Province = mProvince[i]
            arrByProvince.push(arrData.filter(filterByProvince));
        }
        // console.log(arrByProvince);
        showChart(ctx, arrByProvince);
    });
}
