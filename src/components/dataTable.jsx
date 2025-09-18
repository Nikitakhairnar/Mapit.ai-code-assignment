import { useState } from "react";
import { useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  Box,
  TextField,
  InputAdornment,
  Alert,
  Card,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.grey[300],
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [originalRowsData, setOriginalRowsData] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const rowsPerPage = 10;

  useEffect(() => {
    // This will run once when the component mounts
    const fetchData = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/post");
      if (response.status !== 200) {
        setRows([]); // Set rows to empty array on fetch failure
        setIsDataLoading(false);
        return;
      }
      const data = await response.json();

      //format response data to only capture id and title
      const formattedData = data.map(({ id, title, body }) => ({
        id,
        title,
        body: body.substring(0, 100) + "...",
      }));
      setOriginalRowsData(formattedData);
      setRows(formattedData);
      setIsDataLoading(false);
    };
    fetchData();
  }, []);

  // Reset page to 0 if search changes
  useEffect(() => {
    setPage(0);
  }, [search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filter rows by search term (case-insensitive)
  const filterRowsBasedOnSearch = () => {
    const filteredRows = rows.filter((row) =>
      row.title.toLowerCase().includes(search.trim().toLowerCase())
    );
    if (filteredRows.length > 0) {
      setRows(filteredRows);
    } else {
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000); // Hide alert after 2 seconds
    }
  };

  return (
    <Paper
      sx={{
        width: "80%",
        margin: "auto",
        marginTop: 4,
        marginBottom: 4,
      }}
      elevation={3}
    >
      {rows.length > 0 && (
        <>
          <h2>Data</h2>
          <Box sx={{ p: 2, width: "70%", margin: "auto" }}>
            <TextField
              label="Search by Title"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => {
                if (e.target.value === "") {
                  // If search is cleared, refetch original data
                  setRows(originalRowsData);
                }
                setSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  setSearch(e.target.value);
                  if (e.target.value !== "") {
                    //invoke search only when search term is not empty
                    filterRowsBasedOnSearch(); //filter rows based on search term
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      onClick={filterRowsBasedOnSearch}
                      style={{ cursor: "pointer" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {alertVisible && (
            <Alert severity="error" style={{ width: "70%", margin: "auto" }}>
              No results found, try a different search term.
            </Alert>
          )}
          <TableContainer
            component={Card}
            sx={{ margin: "auto", width: "90%", marginBottom: "1rem" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                    Title
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ fontWeight: "bold" }}>
                    Body
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{row.title}</StyledTableCell>
                      <StyledTableCell>{row.body}</StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              style={{ margin: "auto" }}
              count={rows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[rowsPerPage]}
            />
          </TableContainer>
        </>
      )}
      {rows.length === 0 && !isDataLoading && (
        <>
          <h2>Data fetch failed.</h2>
          <p> check your api call and try again, and please try again later.</p>
        </>
      )}
    </Paper>
  );
}
