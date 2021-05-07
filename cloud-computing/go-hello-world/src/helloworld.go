package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
    iexec_out := os.Getenv("IEXEC_OUT")
    iexec_in := os.Getenv("IEXEC_IN")
    dataset_filename := os.Getenv("IEXEC_DATASET_FILENAME")
    if iexec_in == "" {
        panic("No value for IEXEC_IN")
    }
    if iexec_out == "" {
        panic("No value for IEXEC_OUT")
    }

    result := ""

    // Print a message
    if (len(os.Args) > 1) {
        result += "Hello, " + os.Args[1] + "!\n"
    } else {
        result += "Hello, World!\n"
    }

    // Read the content of the dataset if present
    if dataset_filename != "" {
        dataset_filepath := iexec_in + "/" + dataset_filename
        input, err := ioutil.ReadFile(dataset_filepath)
        if err != nil {
            result += "Error reading dataset file - " + err.Error()
        } else {
            result += "Dataset (" + dataset_filepath + "): " + string(input)
        }
    } else {
        result += "No dataset present\n"
    }

    fmt.Println(result)

    // Save result
    err := ioutil.WriteFile(iexec_out + "/result.txt", []byte(result), 0)
    if err != nil {
        log.Fatal(err)
    }

    // Create computed.json file
    dataString := `{"deterministic-output-path\": "` + iexec_out + `/result.txt"}`
    err = ioutil.WriteFile(iexec_out + "/computed.json", []byte(dataString), 0)
    if err != nil {
        log.Fatal(err)
    }
}





// // This function simulates some computation in an iExec application. Script
// // arguments (if provided) are accessible via "sys.argv" array. In this case,
// // if the first argument is present, it is used in the greeting message.
// func doSomeComputation() (string) {
//         if (len(os.Args) < 2) {
//             return "Hello, World!\n"
//         }
//         return "Hello, " + os.Args[1] + "!\n"
// }

// // This function shows how to read a dataset file from an iExec application.
// // Datasets are public in standard mode and confidential in TEE mode.
// // The dataset location and filename are needed to be able to read it. Both
// // of which are provided in the following environment variables:
// //     - IEXEC_IN: the path to the folder where the dataset is located.
// //     - IEXEC_DATASET_FILENAME: the name of the dataset file.
// func handleDataset() string {
//     iexec_in := os.Getenv("IEXEC_IN")
//     dataset_filename := os.Getenv("IEXEC_DATASET_FILENAME")
//     if iexec_in == "" {
//         panic("No value for IEXEC_IN")
//     }
//     if dataset_filename == "" {
//         return "No value for IEXEC_DATASET_FILENAME"
//     }
//     dataset_filepath := iexec_in + "/" + dataset_filename
//     input, err := ioutil.ReadFile(dataset_filepath)
//     if err != nil {
//         // if our program was unable to read the file
//         // print out the reason why it can't
//         panic("Error reading dataset file")
//         // result += "Error reading dataset file - " + err.Error()
//     }
//     // if it was successful in reading the file then
//     // print out the contents as a string
//     return "Dataset (" + dataset_filepath + "): " + string(input)
// }

// // This function shows how to save a result in an iExec application. The result
// // file(s) should be written in the folder indicated by the environment variable
// // IEXEC_OUT. After saving the result, the file "computed.json" must be created
// // in the same folder. It must contain, at least, the path to the determinism
// // file (deterministic-output-path).
// // Example of computed.json file content:
// // {"deterministic-output-path": "app/returnResultJson.json"}
// func saveResult(iexec_out string, result []byte)  {
//     err:= ioutil.WriteFile(iexec_out + "/result.txt", result, 0)
//     if err != nil {
//         log.Fatal(err)
//     }
//     dataString := `{"deterministic-output-path": "` + iexec_out + `/result.txt"}`
//     err = ioutil.WriteFile(iexec_out + "/computed.json", []byte(dataString), 0)
//     if err != nil {
//         log.Fatal(err)
//     }
// }

// defer func() {
//     if err := recover(); err != nil {
//         log.Println("work failed:", err)
//     }
// }()
