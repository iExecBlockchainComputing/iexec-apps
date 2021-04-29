package main

import (
    "os"
    "fmt"
    "io/ioutil"
    "log"
)

func main() {
    iexec_out := os.Getenv("IEXEC_OUT")
    iexec_in := os.Getenv("IEXEC_IN")
    dataset_filename := os.Getenv("IEXEC_DATASET_FILENAME")
    dataset_filepath := iexec_in + "/" + dataset_filename

    // Print a message
    if (len(os.Args) > 1) {
        fmt.Println("Hello, " + os.Args[1] + "!")
    } else {
        fmt.Println("Hello, World!")
    }

    // read in the contents of the dataset
    input, err := ioutil.ReadFile(dataset_filepath)
    if err != nil {
        // if our program was unable to read the file
        // print out the reason why it can't
        fmt.Println("Error reading dataset file -", err)
    } else {
        // if it was successful in reading the file then
        // print out the contents as a string
        fmt.Println("Dataset (" + dataset_filepath + "):", string(input))
    }

    // Append some results
    err = ioutil.WriteFile(iexec_out + "/result.txt", input, 0)
    if err != nil {
        log.Fatal(err)
    }

    // Declare everything is computed
    //{"deterministic-output-path": "app/returnResultJson.json"}
    dataString := "{\"deterministic-output-path\": \"" + iexec_out + "/result.txt\"}"
    dataBytes := []byte(dataString)
    err = ioutil.WriteFile(iexec_out + "/computed.json", dataBytes, 0)
    if err != nil {
        log.Fatal(err)
    }
}
