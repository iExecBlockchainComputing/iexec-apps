package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
    iexecOut := os.Getenv("IEXEC_OUT")
    iexecIn := os.Getenv("IEXEC_IN")
    datasetFilename := os.Getenv("IEXEC_DATASET_FILENAME")
    if iexecIn == "" {
        panic("No value for IEXEC_IN")
    }
    if iexecOut == "" {
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
    if datasetFilename != "" {
        datasetFilepath := iexecIn + "/" + datasetFilename
        input, err := ioutil.ReadFile(datasetFilepath)
        if err != nil {
            log.Fatal("Error reading dataset file", err)
        } else {
            result += "Dataset (" + datasetFilepath + "): " + string(input)
        }
    } else {
        result += "No dataset was found\n"
    }

    fmt.Println(result)

    // Save result
    err := ioutil.WriteFile(iexecOut + "/result.txt", []byte(result), 0)
    if err != nil {
        log.Fatal(err)
    }

    // Create computed.json file
    dataString := `{"deterministic-output-path": "` + iexecOut + `/result.txt"}`
    err = ioutil.WriteFile(iexecOut + "/computed.json", []byte(dataString), 0)
    if err != nil {
        log.Fatal(err)
    }
}
