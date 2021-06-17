import os
import sys
import json
import eth_abi


def do_some_computation():
    """
    This function simulates some computation in an iExec application. Script
    arguments (if provided) are accessible via "sys.argv" array. In this case,
    if the first argument is present, it is used in the greeting message.
    """
    name = sys.argv[1] if len(sys.argv) > 1 else "World"
    greeting = f'Hello, {name}!'
    return greeting


def handle_dataset():
    """
    This function shows how to read a dataset file from an iExec application.
    Datasets are public in standard mode and confidential in TEE mode.
    The dataset location and filename are needed to be able to read it. Both
    of which are provided in the following environment variables:
        - IEXEC_IN: the path to the folder where the dataset is located.
        - IEXEC_DATASET_FILENAME: the name of the dataset file.
    """
    iexec_in = os.environ['IEXEC_IN']
    dataset_filename = os.environ['IEXEC_DATASET_FILENAME']
    dataset_filepath = iexec_in + '/' + dataset_filename
    text = f'\nDataset ({dataset_filepath}): '
    if os.path.isfile(dataset_filepath):
        with open(dataset_filepath) as f:
            text = text + f.read()
    return text


def save_result(result):
    """
    This function shows how to save a result in an iExec application. The result
    file(s) should be written in the folder indicated by the environment variable
    IEXEC_OUT. After saving the result, the file "computed.json" must be created
    in the same folder. It must contain, at least, the path to the determinism
    file (deterministic-output-path).
    """
    iexec_out = os.environ['IEXEC_OUT']
    callback_data = eth_abi.encode_abi(['string'], [result]).hex()
    print('Callback is ready [data:{}, callback-data:{}]'.format(result, callback_data))
    # prepare callback to be sent to the smart-contract
    computed_file_content = {"callback-data": callback_data}
    print(computed_file_content)
    with open(iexec_out + '/computed.json', 'w+') as f:
        json.dump(computed_file_content, f)


if __name__ == '__main__':
    computation_text = do_some_computation()
    print(computation_text)
    dataset_text = handle_dataset()
    print(dataset_text)
    save_result(computation_text)
