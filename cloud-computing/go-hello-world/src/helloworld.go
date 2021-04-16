package main

// import the 2 modules we need
import (
    "os"
    "fmt"
    "io/ioutil"
    "log"
)

func main() {
    iexec_out := os.Getenv("IEXEC_OUT")
    iexec_in := os.Getenv("IEXEC_IN")

    // read in the contents of the localfile.data
    input, err := ioutil.ReadFile(iexec_in + "/input.txt")
    // if our program was unable to read the file
    // print out the reason why it can't
    if err != nil {
        fmt.Println(err)
    }

    // if it was successful in reading the file then
    // print out the contents as a string
    fmt.Print(string(input))
    
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
